#!/bin/bash
project="1782-Dynamics-Sales"
image="1782-dynamics-sales"
echo "Old containers running for $image?"
cont=$(docker ps -aqf "name=$image")
if [ -z "$cont" ]
then
	echo "No old containers running to stop..."
else
    echo "Yes, Stopping old containers..."
    docker stop $cont
fi
echo "Building angular image..."
docker build -t $image ./.docker/node
echo "$project image built successfully!"
echo "Running $project image..."
docker run -dit --rm --name $image -v /$(pwd)/:/var/www/html/$project -p 4200:4200 $image
docker exec -it $image npm install
docker exec -it $image npm run startsslosx
