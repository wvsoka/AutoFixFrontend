docker build -t autofix-frontend .
docker run -d -p 3000:3000 --network autofix_network autofix-frontend