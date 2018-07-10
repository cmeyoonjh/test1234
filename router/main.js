
const fs = require('fs')
const moment = require('moment');
const Web3 = require('web3');
const net = require('net');
const contract = require('truffle-contract');
const fileContents  = fs.readFileSync('./build/contracts/WMUToken.json', 'utf8');
const tocToken_artifacts = JSON.parse(fileContents);
var split = require('split-string');
var mergeJSON = require("merge-json");

var TocCoin = contract(tocToken_artifacts);

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
TocCoin.setProvider(web3.currentProvider);

if (typeof TocCoin.currentProvider.sendAsync !== "function") {
    TocCoin.currentProvider.sendAsync = function() {
        return TocCoin.currentProvider.send.apply(
            TocCoin.currentProvider, arguments
        );
    };
}

function stripHexPrefix(str) {
    return str.startsWith('0x') ? str.slice(2) : str;
}

// Convert byte string to int array.
function bytesToIntArray(byteString) {
    let stripped = stripHexPrefix(byteString);
    return stripped.match(/.{1,64}/g).map(s => parseInt("0x" + s));
}

// Convert byte string to address array
function bytesToAddressArray(byteString) {
    let stripped = stripHexPrefix(byteString);
    return stripped.match(/.{1,40}/g).map(s => "0x" + s);
}

var contractInstance = TocCoin.at("0x852a35374912a9bd281d3006d082d2af0d2ef969");

module.exports = function(app, fs)
{
     app.get('/',async function(req,res){
	let totaltoken2 = await contractInstance.totalSupply();
	totaltoken2=web3._extend.utils.fromWei(totaltoken2,"ether");
	var nowsession = await contractInstance.getCheckSale();
	//console.log("nowsession : " + nowsession);
	var halt = await contractInstance.getHalt(nowsession);
        res.render('index', {title: "MY HOMEPAGE",length: 5, totaltoken2: totaltoken2, halt:halt, nowsession: nowsession})
     });

/*
app.post('/ajax', function(req, res, next) {

    console.log('POST 방식으로 서버 호출됨');

    //view에 있는 data 에서 던진 값을 받아서
    var msg = req.body.msg;
    msg = '[에코]' + msg;

    //json 형식으로 보내 준다.
    res.send({result:true, msg:msg});
});
*/
app.post('/balanceOf', async function(req,res,next) {
        var add = req.body.token_address;
        //console.log("getbalance call");
        //console.log("address : " + add);
        let tokval = await contractInstance.balanceOf(add);
        //console.log("value : " + tokval);
	//var obj = {};
        //obj.TokenBalance=tokval.toNumber();;
        var obj = '';
        obj=tokval.toNumber();
	obj=web3._extend.utils.fromWei(obj,"ether");
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        //res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
        //res.send(obj);
	//res.send({result:true, TokenBalance:obj});
	res.send({result:true, TokenBalance:obj});
        res.end();
});


app.post('/totalSupply', async function(req,res,next) {
	//console.log('totalSupply');
	let totaltoken = await contractInstance.totalSupply();
	var obj = '';
	obj=totaltoken.toNumber();
	obj=web3._extend.utils.fromWei(obj,"ether");
	res.header('Content-type','application/json');
        res.header('Charset','utf8');
	res.send({result:true, totaltokenval:obj});
	res.end;	
	
});

app.post('/session', async function(req,res,next) {
	var sessiondata = req.body.sessiondata;
        //console.log('session');
        let sessiontoken = await contractInstance.getSeasonSupply(sessiondata);
        var obj = '';
        obj=sessiontoken.toNumber();
	obj=web3._extend.utils.fromWei(obj,"ether");
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
	//console.log(web3._extend.utils.fromWei(obj,"ether"));
        res.send({result:true, sessionval:obj});
        res.end;

});

app.get('/getcontract', async function(req, res){
		let season = req.query.season;
		let address = req.query.address;
		var result = [];
		var list = [];
		var wallet_check = address.length;
		//중단		
		if(wallet_check == 42 || wallet_check == 0) {
		} else {
			res.send('wallet input error!!');
                        res.end();
		}
                    if(season == "" || season == 0){ //전체검색
                         for(var i=1; i <= 6; i++) {
                             var breakdown_length = await contractInstance.getBreakdown_length.call(i);
                             for(var j=0; j<breakdown_length; j++) {
				     var check_obj = {};
				     var breakdown = await contractInstance.saleBreakdown.call(i,j);
				     var saleBreakdown = breakdown.toString().split(",");
				     check_obj.address = saleBreakdown[0];
				     check_obj.token = saleBreakdown[1];
				     check_obj.ether = saleBreakdown[2];
				     check_obj.date = saleBreakdown[3];
				     check_obj.season = ""+i+"";
				     list.push(check_obj);
			     }
                         }
                    } else if(season == 1 || season == 2 ||  season == 3 || season == 4 || season == 5 || season == 6){ //시즌별검색
                        var breakdown_length = await contractInstance.getBreakdown_length.call(season);
                        for(var i=0;i<breakdown_length;i++){
				     var check_obj = {};
                                     var breakdown = await contractInstance.saleBreakdown.call(season,i);
                                     var saleBreakdown = breakdown.toString().split(",");
                                     check_obj.address = saleBreakdown[0];
                                     check_obj.token = saleBreakdown[1];
                                     check_obj.ether = saleBreakdown[2];
                                     check_obj.date = saleBreakdown[3];
                                     check_obj.season = season
                                     list.push(check_obj);
			}
                    } else{
                      //중단
			res.send('season input error!!');
		        res.end();			
                    }

                    for(var breakdown_list in list){
			var obj = {};
			//var s = (list[breakdown_list]).toString().split(",");
			//ether 환산
			list[breakdown_list].token=web3._extend.utils.fromWei(list[breakdown_list].token,"ether");
                        list[breakdown_list].ether=web3._extend.utils.fromWei(list[breakdown_list].ether,"ether");
                        //시간 처리
                        var date = new Date(parseInt(list[breakdown_list].date) * 1000);
                        if(parseInt(date.getMonth()+1) < 10) var new_month =  "0" + parseInt(date.getMonth()+1);
                        else var new_month = parseInt(date.getMonth()+1);
                        if(date.getDate().toString().length == 1) var new_date =  "0" + date.getDate().toString();
                        else var new_date = date.getDate().toString();
                        if(date.getHours().toString().length == 1) var new_hours =  "0" + date.getHours().toString();
                        else var new_hours = date.getHours().toString();
                        if(date.getMinutes().toString().length == 1) var new_minutes =  "0" + date.getMinutes().toString();
                        else var new_minutes = date.getMinutes().toString();
                        list[breakdown_list].date = date.getFullYear().toString() + "-"
                               + new_month + "-"
                               + new_date + " "
                               + new_hours + ":"
                               + new_minutes;

			 obj.address = list[breakdown_list].address;
                         obj.token = list[breakdown_list].token;
                         obj.ether = list[breakdown_list].ether;
                         obj.date = list[breakdown_list].date;
			 obj.season = list[breakdown_list].season;
			//address 검색
		       if(address != "" && address != null) {
                            if(address == list[breakdown_list].address){
				result.push(obj);
			    }
		       }else{
			        result.push(obj);
		       }
                    }
	res.header('Content-type','application/json');
        res.header('Charset','utf8');
        console.log(result);
        res.send(JSON.stringify(result));
        res.end();
});

}

