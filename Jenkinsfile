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
                    credentialsId: 'aws-ecr']
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