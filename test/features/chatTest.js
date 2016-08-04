var io = require('socket.io-client');
var expect = require('chai').expect;

var socketURL = 'http://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};

describe("Chat Server",function(){

  xit('Should be able to broadcast messages', function(done){

    this.timeout(10000);

    var client1, client2, client3;
    var message = 'Hello World';
    var messages = 0;

    var checkMessage = function(client){
      client.on('message', function(msg){
        expect(message).to.equal(msg);
        client.disconnect();
        messages++;
        if(messages === 3){
          done();
        }
      });
    };

    client1 = io.connect(socketURL, options);
    checkMessage(client1);

    client1.on('connect', function(data){
      client2 = io.connect(socketURL, options);
      checkMessage(client2);

      client2.on('connect', function(data){
        client3 = io.connect(socketURL, options);
        checkMessage(client3);

        client3.on('connect', function(data){
          client2.emit(message);
        });
      });
    });
  });

});
