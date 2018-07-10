build:
	docker build -t gomtopia/perfi:1.0 .
run:
	docker run -t -d -p 8000:8000 --name perfi -v $(CURDIR):/perfi gomtopia/perfi:1.0; docker exec -it perfi npm install; docker exec -it perfi npm run dev
stop:
	docker stop perfi; docker rm perfi
bash:
	docker exec -it perfi /bin/bash
