pipeline {

    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '864241680365'

        BACKEND_REPO = 'fishprice-backend'
        FRONTEND_REPO = 'fishprice-frontend'

        BACKEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
        FRONTEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Test EC2 SSH') {
            steps {
                sshagent(['5ede2432-7fbe-44c9-88d6-e456030ae61b']) {
                    bat '''
                        ssh -o StrictHostKeyChecking=no ubuntu@54.167.192.77 "echo EC2 SSH connection successful && docker --version"
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                bat '''
                    docker build -t %BACKEND_IMAGE%:%IMAGE_TAG% ./backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                bat '''
                    docker build -t %FRONTEND_IMAGE%:%IMAGE_TAG% .
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'github-ecr-user']
                ]) {
                    bat '''
                        aws sts get-caller-identity

                        aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com
                    '''
                }
            }
        }

        stage('Push Backend') {
            steps {
                bat '''
                    docker push %BACKEND_IMAGE%:%IMAGE_TAG%
                '''
            }
        }

        stage('Push Frontend') {
            steps {
                bat '''
                    docker push %FRONTEND_IMAGE%:%IMAGE_TAG%
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend and Backend images pushed successfully to ECR.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}