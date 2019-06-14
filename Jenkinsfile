pipeline {
  agent any
  options {
    timeout(time: 10, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  stages {
    stage('Docker build') {
      steps {
        sh 'docker build -t dockflow/geofence-demo/$GIT_BRANCH .'
        sh 'cd /app && y \'\' |  docker-compose up -d --no-recreate'
        sh 'docker pull dockflow/geofence-demo/$GIT_BRANCH && docker restart demo-$GIT_BRANCH'
      }
    }
  }
}