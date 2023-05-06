#include <iostream>
#include <pqxx/pqxx>
#include "../lib/http.hpp"
#include "../lib/json.hpp"

using namespace std;
using namespace httplib;
using json = nlohmann::json;

auto i_from(const string &filename, int i = 0) {
  ifstream file(filename);
  string line;
  if (i == 0) goto end;
  for (int j = 0; j < i; ++j) {
    file >> line;
  }
  end:
  file >> line;
  return line;
}

auto get_from_sql(const string &url, const string &s) {
  using namespace pqxx;
  cout << "sql >> " << s << "...";
  connection CONN(url);
  nontransaction conn(CONN);
  auto out = conn.exec(s);
  cout << "done: " << out.size() << endl;
//  return conn.exec(s);
  return out;
}

void send_to_sql(const std::string &url, const std::string &s) {
  std::cout << "sql << " << s << std::endl;
  pqxx::connection CONN(url);
  pqxx::work c(CONN);
  c.exec(s);
  c.commit();
}

int main() {
  const string sql_url = "postgresql://hecker:"
                         + i_from("settings.txt")
                         + "@chill-whale-766.g8z.cockroachlabs.cloud:26257/wolf23?sslmode=verify-full";
  Server server;
  vector<Client> other_servers; // for mesh, later time
  /*
   * Post: User sends qr location
   * - Find things nearby
   */

  server.Get("/hi", [](auto req, auto &res) {
      res.set_content("yo", "text/plain");
  });

  /**
   * Get the available postings in the area
   * Post:
   * {
   *    lat: float
   *    long: float
   * }
   */
  server.Post("/info", [sql_url](auto req, auto &res) {
      res.set_header("Access-Control-Allow-Origin", "*");
      json in = json::parse(req.body);
      json out;
      out["time"] = time(nullptr);
      out["data"] = {};
      string sql = "select lat, lon, type from locations where "
                   "ABS(" + to_string(in["lat"].get<float>()) + " - lat) < 4"
                   + " AND ABS(" + to_string(in["lon"].get<float>()) + " - lon) < 4";
      for (auto row: get_from_sql(sql_url, sql)) {
        cout << "lat:" << row[0] << " | lon:" << row[1] << endl;
        out["data"] += {
            {"lat",  row[0].as<float>()},
            {"lon",  row[1].as<float>()},
            {"type", row[2].as<int>()},
        };
      }
      res.set_content(out.dump(), "application/json");
  });

  server.Post("/add", [sql_url](auto req, auto &res) {
      res.set_header("Access-Control-Allow-Origin", "*");
      json in = json::parse(req.body);

      send_to_sql(sql_url, "INSERT INTO locations (lat, lon, type) VALUES ("
                           + to_string(in["lat"].get<float>()) + ","
                           + to_string(in["lon"].get<float>()) + ","
                           + to_string(in["type"].get<int>()) + ");");

      res.set_content(R"({"value":"added"})", "application/json");
  });

  server.set_logger([](const auto &req, const auto &res) {
      std::cout << "req: " << req.body << "\t-\tres: " << res.body << std::endl;
  });

  server.listen("0.0.0.0", 8080);
  return 0;
}
