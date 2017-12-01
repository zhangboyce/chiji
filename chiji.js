var socket = require('socket.io-client')('http://192.168.60.143:8008');
var myName = '啪啪啪';

var guijix = [];
var guijiy = [];

function play(name) {
    socket.on('connect', function () {
        console.log('准备吃鸡!!!');
        socket.emit('register', name, function () {
            console.log('开始吃鸡!!!');
        });

        socket.on('info', function (info) {
            var me = find(info.users, myName) || {};
            var x = me.x || 0;
            var y = me.y || 0;
            if (me && !me.alive) return;

            guijix.push(x);
            guijiy.push(y);

            var other = find(info.users, 'wen') || {};
            var wx = other.x || 0;
            var wy = other.y || 0;

            while (!other || !other.alive) {
                other = findAlive(info.users);
            }

            var ofx = Math.abs(x - wx);
            var ofy = Math.abs(y - wy);
            var shootDeg = Math.atan(ofx / ofy);

            if (x <= wx) {
                if (y >= wy) {
                } else {
                    shootDeg = Math.PI - shootDeg;
                }
            } else {
                if (y >= wy) {
                    shootDeg = 2 * Math.PI - shootDeg;
                } else {
                    shootDeg = Math.PI + shootDeg;
                }
            }

            console.log(kasi());

            let randomShootOffsetDeg = Math.random() * (kasi() ? Math.PI/2 : Math.PI/3);
            let randomMoveOffsetDeg = Math.random() * (kasi() ? Math.PI/2 : Math.PI/3);

            var moveDeg = Math.abs(Math.PI - shootDeg) + randomMoveOffsetDeg;
            shootDeg = shootDeg + randomShootOffsetDeg;

            socket.emit('move', moveDeg);
            socket.emit('shoot', shootDeg);
        });
    });
}

function find(users, name) {
    var index = users.findIndex(function(user) {
        return user.name == name;
    });
    return index == -1 ? null : users[index];
}

function findAlive(users) {
    var index = users.findIndex(function(user) {
        return user.alive;
    });
    return index == -1 ? null : users[index];
}

function kasi() {
    return kasix() || kasiy();
}

function kasix() {
    var length = guijix.length;
    return length >= 3 &&
        guijix.slice(length - 3, length).filter(unique).length == 1;
}

function kasiy() {
    var length = guijiy.length;
    return length >= 3 &&
        guijiy.slice(length - 3, length).filter(unique).length == 1;
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

play(myName);
