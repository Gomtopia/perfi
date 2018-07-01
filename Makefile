build:
	docker build -t gomtopia/perfi:1.0 .
run:
	docker run -t -d -p 8000:8000 --name perfi -v $(CURDIR):/app gomtopia/perfi:1.0
stop:
	docker stop perfi; docker rm perfi
bash:
	docker exec -it perfi /bin/bash
