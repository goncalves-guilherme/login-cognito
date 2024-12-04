# Terraform Cognito Module Setup

# Table of Contents

1. [Prerequisites](#prerequisites)
   - [1. Terraform](#1-terraform)
   - [2. AWS Account](#2-aws-account)
   - [3. AWS CLI](#3-aws-cli)
   - [4. Configure AWS CLI with Default Profile](#4-configure-aws-cli-with-default-profile)
   
2. [Overview](#overview)

3. [Modules](#modules)
   - [Cognito Module (./modules/cognito)](#cognito-module-modulescognito)
   - [Lambda Module (./modules/lambda)](#lambda-module-moduleslambda)

4. [Usage](#usage)
   - [1. Compile Lambda and Apply Terraform Configurations](#1-compile-lambda-and-apply-terraform-configurations)
   - [2. Clean All Resources Created in AWS](#2-clean-all-resources-created-in-aws)
  
5. [Extras](#extras)




This repository contains Terraform configurations for setting up AWS Cognito with Lambda integration for pre-sign-up hooks. It includes resources for Cognito User Pools, User Pool Clients, Lambda functions, and the necessary IAM roles and policies.

## Prerequisites

Before you can run the application, ensure you have the following tools installed and configured:

### 1. [Terraform](https://www.terraform.io/)
Terraform is used to manage your infrastructure as code. Make sure you have Terraform installed on your local machine.

- **Installation**: Follow the instructions on the [Terraform installation page](https://www.terraform.io/downloads.html) to install Terraform for your operating system.

### 2. [AWS Account](https://aws.amazon.com/console/)
You will need an AWS account to access AWS services, including Cognito. If you do not have an AWS account, sign up for one at the link above.

If your user does not have administration access, you need to ensure that they have all the necessary permissions to execute this Terraform infrastructure.

### 3. [AWS CLI](https://aws.amazon.com/cli/)
The AWS CLI is required to interact with AWS services from the command line. It helps configure the AWS profile for Terraform and other AWS services.

- **Installation**: Follow the instructions to [install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) for your operating system.

### 4. Configure AWS CLI with Default Profile
Terraform configurations in this project are set to use the AWS default profile. To use this profile, you need to configure it with the `aws configure` command.

Run the following command to set up the AWS CLI with your aws user credentials:

```bash
aws configure
```

## Overview
This configuration provisions the following:

1. Cognito User Pool: Manages user authentication and user attributes.
2. Cognito User Pool Client: Allows applications to authenticate users with the User Pool.
3. Lambda Function: A pre-sign-up hook for custom validation logic.
4. IAM Roles and Policies: Grants the Lambda function permissions for logging and interacting with Cognito.
5. S3 Bucket: Create private S3 bucket to store static website
6. Cloudfront: CDN to distribute the static website across different edge locations
7. A Makefile with the apply command that zips the Python Lambda code into a ZIP file to be imported by the Lambda service and apply the terraform code.


## Modules
### Cognito Module (./modules/cognito)

Manages the creation of the Cognito User Pool and associated resources.

### Lambda Module (./modules/lambda)
Manages the creation of the Lambda function used in the Cognito User Pool for pre-sign-up hooks.

For the python lamdba code we need to zip the ./modules/lambda/lambda_function to a zip to be imported in lambda service. You can do this automaticly by using make command; 

```bash
make lambda-zip
```

### S3 Module (./modules/s3)

Manages the creation of an S3 bucket to store static website content.

This module will create:

- Private S3 Bucket: For storing your static website files.
- Bucket Policies: To ensure the bucket is properly configured for the cdn distribution use.

### Cloudfront Module (./modules/cloudfront)

Manages the creation of a CloudFront distribution to deliver the static website stored in S3 across different geographic locations.

This module will create:

- CloudFront Distribution: For caching and delivering your website with low latency.


## Usage

After garantee that you have a aws credentials with the needed permissions configured as a default aws profile you can run the following commands

1. Compile lambda for cognito pre-signin hooks and apply the terraform configurations
```bash
make apply
```
2. Clean all resources created in aws
```bash
make clean
```