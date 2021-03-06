
# nodejs-ecs
Sample nodejs application deployed in Amazon ECS

# Instructions

To create a container running in Amazon ECS you will need to create a new docker context. Let's call this context `ecscontext`, which can be created by the following command
```
docker context create ecs ecscontext
```

You can choose to authenticate with AWS using an existing profile, or provide aws credentials
```
? Create a Docker context using:  [Use arrows to move, type to filter]
  An existing AWS profile
> AWS secret and token credentials
  AWS environment variables
```

This guide assumes that you already have AWS secret and token, and choose the second option. If you don't have AWS credential yet, you can create an IAM user in AWS console by following [this guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html). You will also have to specify your AWS region
```
? AWS Access Key ID <your AWS access key>
? Enter AWS Secret Access Key ****************************************
? Region  [Use arrows to move, type to filter]
  ap-northeast-1
  sa-east-1
  ca-central-1
> ap-southeast-1
  ap-southeast-2
  eu-central-1
  us-east-1
```

Enable your recently created docker context
```
docker context use ecscontext
```

Simply run the following command to start your docker container in your ECS. 
```
docker compose up
```

Docker Compose will take care of orchestrating all necessaries infrastructure (like creating a VPC, adding a load balancer, etc.), so it may take a while for the command above to finish. Your terminal may look like this during this time
```
WARNING services.scale: unsupported attribute
[+] Running 10/12
 ⠸ nodejs-ecs                       CreateInProgress User Initiated                                                                                                                                                       157.4s
 ⠿ Cluster                          CreateComplete                                                                                                                                                                          7.0s
 ⠿ NodewebappTCP8080TargetGroup     CreateComplete                                                                                                                                                                          2.0s
 ⠿ NodewebappTaskExecutionRole      CreateComplete                                                                                                                                                                         15.3s
 ⠿ CloudMap                         CreateComplete                                                                                                                                                                         48.2s
 ⠿ DefaultNetwork                   CreateComplete                                                                                                                                                                          6.2s
 ⠸ LoadBalancer                     CreateInProgress Resource creation Initiated                                                                                                                                          153.4s
 ⠿ LogGroup                         CreateComplete                                                                                                                                                                          3.0s
 ⠿ DefaultNetworkIngress            CreateComplete                                                                                                                                                                          1.3s
 ⠿ Default8080Ingress               CreateComplete                                                                                                                                                                          0.7s
 ⠿ NodewebappTaskDefinition         CreateComplete                                                                                                                                                                          2.8s
 ⠿ NodewebappServiceDiscoveryEntry  CreateComplete
```

After your container is up, you can check its state by running this command
```
docker compose ps
```

You may see something like this
```
NAME                                               COMMAND             SERVICE             STATUS              PORTS
task/nodejs-ecs/8ce1835a4add40b9b37756a7b30b6bab   ""                  mongodb             Running             nodej-LoadB-1ILT2VHIRQZ2-f8f079105d731d6c.elb.us-east-1.amazonaws.com:27017:27017->27017/tcp
task/nodejs-ecs/c77b152f46674bcbb3c093faff80d70f   ""                  node-web-app        Running             nodej-LoadB-1ILT2VHIRQZ2-f8f079105d731d6c.elb.us-east-1.amazonaws.com:8080:8080->8080/tcp
```

Your nodejs app can now be accessed via an URL that resembles this `nodej-LoadB-262POKSPFTG8-3702ec0510d1dcf9.elb.us-east-1.amazonaws.com:8080`

There are 2 end-points to explore:
- `/create` is an end-point to save a sample employee object into mongodb. The employee object looks like this:
```
{
  "EmployeeID": 4,
  "EmployeeName": "John Doe"
}
```
- `/list` is an end-point to list all employees in mongodb. The response may look like this:
```
[
  {
    "_id": "626d2c0cd7a5b2af01208c98",
    "EmployeeID": 4,
    "EmployeeName": "John Doe"
  }
]
```

You can also check the states of all your running containers in ECS by this command
```
docker compose ls
```

To shutdown your container, enter this command
```
docker compose down
```

To switch back to docker default context, run this command
```
docker context use default
```

# Improvements
- [ ] Update `/create` end-point to use method `POST` instead of `GET`, and allow clients to specify employee name
- [ ] Add `/update` end-point to allow updating an employee name given their ID
- [ ] Add `/delete` end-point to allow deleting an employee given their ID
- [ ] Implement pagination for `/list` end-point