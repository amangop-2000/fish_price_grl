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

        EC2_HOST = '54.167.192.77'
        EC2_USER = 'ubuntu'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
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

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'ec2-ssh-key',
                        variable: 'EC2_KEY'
                    )
                ]) {
                    bat '''
                        echo Fixing SSH key permissions...

                        icacls "%EC2_KEY%" /inheritance:r
                        icacls "%EC2_KEY%" /grant:r "SYSTEM:F"
                        icacls "%EC2_KEY%" /grant:r "Administrators:F"

                        echo Deploying to EC2...

                        ssh -i "%EC2_KEY%" -o StrictHostKeyChecking=no ubuntu@%EC2_HOST% "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 864241680365.dkr.ecr.us-east-1.amazonaws.com && cd /home/ubuntu/fishprice && sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=%IMAGE_TAG%/' .env.deploy && docker compose pull && docker compose up -d"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}