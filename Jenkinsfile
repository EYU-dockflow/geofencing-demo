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
        sh 'docker stop demo-$GIT_BRANCH || true && docker rm demo-$GIT_BRANCH || true && docker run -d dockflow/geofence-demo/$GIT_BRANCH'
      }
    }
  }
}