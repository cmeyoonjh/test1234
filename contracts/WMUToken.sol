pragma solidity ^0.4.24;
import "./Pausable.sol";
import "./BasicToken.sol";
import "./SafeMath.sol";
import "./PeriodConfig.sol";

contract WMUToken is PeriodConfig, Pausable, BasicToken{
    using SafeMath for uint256;

    string public constant name = "WMUToken";
    string public constant symbol = "WMU";

    mapping (uint => bool) tokenMoveCheck;

    constructor() public {
        for(uint i = 1; i <= saleType.length; i++){
            totalSupply_ = totalSupply_.add(saleData["totalSupply"][i]);            //token totalSupply setting.
        }
        balances[msg.sender] = balances[msg.sender].add(300000000);
        //일정비율 토큰을 메인계좌로 발행 balances[msg.sender] = 얼마;
    }

    function () public payable {
        uint sale = getCheckSale();                                 //get sale period array index.
        require(!getHalt(sale));                                     //check to ICO open state. getHalt function is need sale type array index
        if(!tokenMoveCheck[sale] && sale != 1) _tokenMove(sale);
        uint tokens = saleData["rate"][sale].mul(msg.value);             //multiply ether a token rate.
        require(saleData["totalSupply"][sale] >= tokens);                //If that sale period a total supply is sold out, no sale

        balances[msg.sender] = balances[msg.sender].add(tokens);     //Token add to msg.sender.

        //sale breakdown save
        Breakdown memory breakdown;
        breakdown.userAddress = msg.sender;
        breakdown.token_value = breakdown.token_value.add(tokens);
        breakdown.ether_value = breakdown.ether_value.add(msg.value);
        breakdown.insertTime = now;
        saleBreakdown[sale].push(breakdown);

        totalSupply_ = totalSupply_.add(tokens);
        saleData["totalSupply"][sale] = saleData["totalSupply"][sale].sub(tokens); //시즌총량에서 빼기

        emit Transfer(address(0),msg.sender,tokens);
        owner.transfer(msg.value);  //Transfer ether to owner
    }
      function transfer(
        address _to,
        uint256 _value
      )
        public
        onlyIfWhitelisted(msg.sender)
        returns (bool)
      {
        return super.transfer(_to, _value);
      }

    function getCheckSale() public view returns(uint){      //현재 어떤 sale인지 출력
          for(uint i=0;i<saleType.length;i++){
              if(now >= saleData["startTime"][i+1] && now < saleData["endTime"][i+1]){
                return i+1;
              }
          }
          return 0;
     }

    function getSeasonSupply(uint _season) public view returns(uint){       //특정 sale의 토큰 잔고 출력
        return saleData["totalSupply"][_season];
    }

    function _tokenMove(uint _sale) internal{          //토큰이월
        for(uint i=1;i<_sale;i++){
            saleData["totalSupply"][_sale] = saleData["totalSupply"][_sale].add(saleData["totalSupply"][i]);
            saleData["totalSupply"][i] = 0;
        }
        tokenMoveCheck[_sale] = true;
    }

  function getHalt(uint sale) public view returns(bool){    //현재 ICO오픈상태 출력
      if(sale == 0) return true;
      return paused;
  }
  function burnToken() public onlyOwner{    // 세일기간이 아니면 남은토큰 소각
    require(getCheckSale() == 0);
    for(uint i = 1; i <= saleType.length; i++){
        totalSupply_ = totalSupply_.sub(saleData["totalSupply"][i]);
        saleData["totalSupply"][i] = 0;
    }
  }
}
