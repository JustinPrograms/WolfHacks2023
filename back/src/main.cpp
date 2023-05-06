#include <iostream>
#include <pqxx/pqxx>
#include "../lib/http.hpp"
#include "../lib/json.h"

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

int main() {
  const string sql_url = "postgresql://hecker:"
                         + i_from("settings.txt")
                         + "@chill-whale-766.g8z.cockroachlabs.cloud:26257/wolf23?sslmode=verify-full";
  Server server;
  vector<Client> other_servers; // for mesh, later time

//  for (auto i: get_from_sql(sql_url, "SELECT lat, long FROM locations")) {
//    cout << "lat:" << i[0]
//         << " | long:" << i[1]
//         << endl;
//  }

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
      // TODO: send available postings in the area
      json out;
      out["time"] = time(nullptr);
      for (auto row : get_from_sql(sql_url, "SELECT lat, long, type FROM locations where"))
//      res.set_content("not implemented", "text.plain");
  });

//  server.Post("/net/add", [](auto req, auto &res) {
//      res.set_content(json{
//              {""}
//      })
//  })

  server.listen("0.0.0.0", 8080);
  return 0;
}
