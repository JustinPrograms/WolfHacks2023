cmake_minimum_required(VERSION 3.25)
project(back)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -lpqxx -lpq -pthread")

find_package(OpenSSL REQUIRED)

add_executable(back src/main.cpp lib/http.hpp lib/json.h)

target_link_libraries(back OpenSSL::SSL)
