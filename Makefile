:build
	docker build . --name rest-app-image
:run
	docker run -d -p 3000:3000 --rm --rest-app:main
:stop
	docker stop rest-app:main
