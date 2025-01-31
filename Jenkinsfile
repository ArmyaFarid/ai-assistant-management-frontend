#!groovy
pipeline {
    agent none  // No global agent is defined, each stage defines its agent

    stages {
        stage('Build Docker Image') {
            options {
                timeout(time: 3, unit: 'HOURS')  // timeout on this stage
            }
            agent any  // This stage will use any available agent for execution
            steps {
                script {
                    sh '''
                        # Build the Docker image using Docker Compose
                        docker compose build --no-cache
                    '''
                }
            }
        }

        stage('Unmount Docker Container') {
            options {
                timeout(time: 1, unit: 'HOURS')  // timeout on this stage
            }
            agent any  // This stage will use any available agent for execution
            steps {
                script {
                    sh '''
                        # Bring up the container using Docker Compose
                        docker compose down
                    '''
                }
            }
        }

        stage('Run Docker Container') {
            options {
                timeout(time: 1, unit: 'HOURS')  // timeout on this stage
            }
            agent any  // This stage will use any available agent for execution
            steps {
                script {
                    sh '''
                        # Bring up the container using Docker Compose
                        docker compose up -d
                    '''
                }
            }
        }

    }
}
