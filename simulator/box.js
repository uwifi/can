yaml = require('js-yaml');
fs = require('fs');
const commandLineArgs = require('command-line-args')
 
const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'config', type: String, multiple: false, defaultOption: true }
];


function usage(){
	console.log('Box --config configfilename');
};


let Peer = function(ip)
{
    this.ip = ip;
    this.connect = function(){
        console.log('try to connect '+this.ip+'....done!');
        return true;
    }
}


let Box = function(config ) {
    this.name = config.name;
    this.id = config.id;
    this.bandwidth = config.bandwidth;
    this.storage = config.storage;
    this.peers = config.peers;
    this.totalUpload = 0;
    this.totalDownload = 0;
    this.upload = 0;
    this.download = 0;
    this.usedStorage = 0;
    
    this.startTime =(new Date()).getTime(); 
    this.baseTime = this.startTime;

    return this;
};


Box.register = function() {

}

Box.prototype.connectPeers = function() {    
    this.peers.map(function(peer) {
        if(!(peer instanceof Peer))
        peer = new Peer(peer);
        peer.connect();
    });
};


Box.loadKnownPeers = function() {

};

Box.addKnownPeer=function(peer) {
    this.peers = Box.loadKnownPeers();

};


Box.prototype.serve = function(){
    var that = this;
    setInterval(function(){
        that.totalUpload++;
        that.totalDownload++;
        that.totalOnTime = (new Date()).getTime() - that.startTime;
        that.upload ++; 
        that.download ++;    
        that.time_continue = (new Date()).getTime() - that.baseTime;
    },10);
};

Box.prototype.reachTransactionPoint = function(){
    this.bandTime = this.time_continue*this.uploadBand;
    this.spaceTime = this.time_continue*this.storage;
    return(this.bandTime>this.bandTimeThreshold&&this.spaceTime>this.spaceTimeThrehold)
    
}

Box.prototype.reportTransaction = function(){
    if(this.reachTransactionPoint()){
        broadCastTransactionToPeers();
        broadCastTransactionToNode();
    }
}

Box.prototype.verifyTransaciton = function(trans){
    //the trans is received from 
}

Box.prototype.dispatchRequest = function(){

}

Box.prototype.listRequestCoperator = function(){
    //
    /*let coperators = {
        'ID':{
            
            peerIp:'',
            requests : []
        },
        ...
    };
    */
};



const options = commandLineArgs(optionDefinitions)
if(!options.config)
{
    usage();
    process.exit(1);
}
// Get document, or throw exception on error
try {

    var doc = yaml.safeLoad(fs.readFileSync(options.config, 'utf8'));
    console.log(doc);
    var box = new Box(doc); 
    box.connectPeers();
    box.serve();
} catch (e) {
    console.log(e);
}

