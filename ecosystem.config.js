module.exports = {
    apps : [
      /*{
        name   : "Monitor",
        script : "node monitor.js"
    },*/
    {
        name   : "Pool Process 1",
        script : "node poolProcess.js --skip=0"
    },
    {
        name   : "Pool Process 2",
        script : "node poolProcess.js --skip=1000"
    },
    {
        name   : "Pool Process 3",
        script : "node poolProcess.js --skip=2000"
    },
    {
        name   : "Pool Process 4",
        script : "node poolProcess.js --skip=3000"
    },
    {
        name   : "Pool Process 5",
        script : "node poolProcess.js --skip=4000"
    },
    {
        name   : "Pool Process 6",
        script : "node poolProcess.js --skip=5000"
    },
    {
        name   : "Pool Process 7",
        script : "node poolProcess.js --skip=6000"
    },
    {
        name   : "Pool Process 8",
        script : "node poolProcess.js --skip=7000"
    },
    {
        name   : "Pool Process 9",
        script : "node poolProcess.js --skip=8000"
    },
    {
        name   : "Pool Process 10",
        script : "node poolProcess.js --skip=9000"
    }]
  }