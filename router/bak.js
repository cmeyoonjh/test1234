app.get('/getcontract', async function(req, res){
//        var address = req.params.address;
	let season = req.query.season;	
	let address = req.query.address;
	var result = [];	
	// 특정 시즌에 투자한  회원 수 조회..
	if(season == 1 || season == 2 ||  season == 3 || season == 4 || season == 5 || season == 6) {
		let list = await contractInstance.getBreakdown_length.call(season);
	} else {
		let allseason = 6;
	}
	// 특정 시즌에 회원 수만큼 for문을 돌며 회원리스트 출력.
            for(var i=0; i < list; i++) {
		var obj = {};
                let list2 = await contractInstance.saleBreakdown.call(season,i);
		var s = list2.toString().split(",");
		s[1]=web3._extend.utils.fromWei(s[1],"ether");
		s[2]=web3._extend.utils.fromWei(s[2],"ether");
		//시간 처리
		var date = new Date(parseInt(s[3]) * 1000);
		if(parseInt(date.getMonth()+1) < 10) var new_month =  "0" + parseInt(date.getMonth()+1);
		else var new_month = parseInt(date.getMonth()+1);
		if(date.getDate().toString().length == 1) var new_date =  "0" + date.getDate().toString();
		else var new_date = date.getDate().toString();
		if(date.getHours().toString().length == 1) var new_hours =  "0" + date.getHours().toString();
                else var new_hours = date.getHours().toString();
		if(date.getMinutes().toString().length == 1) var new_minutes =  "0" + date.getMinutes().toString();
                else var new_minutes = date.getMinutes().toString();

		s[3] = date.getFullYear().toString() + "-" 
		      + new_month + "-"
                      + new_date + " "
                      + new_hours + ":"
                      + new_minutes; 
		if(address == s[0]) {
			console.log('address 있음!!');
			obj.address=s[0];
			obj.token=s[1];
			obj.ether=s[2];
			obj.date=s[3];
			result.push(obj); 
		} else {
			console.log('address 없음!!');
                        obj.address=s[0];
                        obj.token=s[1];
                        obj.ether=s[2];
                        obj.date=s[3];
                        result.push(obj);
		}
            }
	res.header('Content-type','application/json');
	res.header('Charset','utf8');
	console.log(result);
	//res.send(req.query.callback + '{'+ JSON.stringify(result) + '};');
	res.send(JSON.stringify(result));
	res.end();
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

