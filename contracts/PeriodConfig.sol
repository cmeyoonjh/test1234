pragma solidity ^0.4.21;

/*
 * @title Period Config
 * @dev ICO period, rate setting contract.
 */
contract PeriodConfig {
    uint8 public constant decimals = 18;

    struct Breakdown{
        address userAddress;
        uint token_value;
        uint ether_value;
        uint insertTime;
    }
    mapping (uint => Breakdown[]) public saleBreakdown;                          //saleBreakdown[어떤시즌에] = 값(배열); 각세일별 이더, 토큰구매내역
    mapping (string => mapping(uint => uint)) internal saleData;                //saleData[어떤데이터][몇번째] = 데이터값;

    string[] public saleType = ["pri-sale","pre-sale 1th","pre-sale 2th", "ICO"];

    constructor() public {
    //start Time
        /*saleData["startTime"][1] = now;
        saleData["startTime"][2] = now + 1;
        saleData["startTime"][3] = now + 2;
        saleData["startTime"][4] = now + 3;*/

        saleData["startTime"][1] = 1531699200000;
        saleData["startTime"][2] = 1533081600000;
        saleData["startTime"][3] = 1535760000000;
        saleData["startTime"][4] = 1538352000000;

    //end Time
        /*saleData["endTime"][1] = now + 1 days - 1 seconds;
        saleData["endTime"][2] = now + 2 days - 1 seconds;
        saleData["endTime"][3] = now + 3 days - 1 seconds;
        saleData["endTime"][4] = now + 4 days - 1 seconds;*/

        saleData["endTime"][1] = 1532735999000;
        saleData["endTime"][2] = 1535759999000;
        saleData["endTime"][3] = 1538351999000;
        saleData["endTime"][4] = 1546300799000;

    //token rate
        saleData["rate"][1] = 35046;
        saleData["rate"][2] = 17523;
        saleData["rate"][3] = 15020;
        saleData["rate"][4] = 10514;

    //total supply
        saleData["totalSupply"][1] = 150000000 * (10 ** uint256(decimals));
        saleData["totalSupply"][2] = 450000000 * (10 ** uint256(decimals));
        saleData["totalSupply"][3] = 450000000 * (10 ** uint256(decimals));
        saleData["totalSupply"][4] = 450000000 * (10 ** uint256(decimals));

    }
    function getBreakdown_length(uint _sale) public view returns(uint){     //거래내역 saleBreakdown의 length
        return saleBreakdown[_sale].length;
    }
    function getSale_length() public view returns(uint){     //sale 종류의 length
        return saleType.length;
    }

}
    //privateSale	= 1;
    //pre-sale 2th = 2;
    //pre-sale 2th = 3;
    //ICO	= 4;

    //ETH 0.1 minimum
    //uint public saleMinimumWei = 1 * (10 ** uint256(decimals)) / 10;
    //ETH 50 maximum
    //uint public saleMaximumWei = 50 * (10 ** uint256(decimals));

//uint[] public totalSupplyList = [100000000 * (10 ** uint256(decimals)), 300000000 * (10 ** uint256(decimals)), 300000000 * (10 ** uint256(decimals)), 300000000 * (10 ** uint256(decimals)), 499960000 * (10 ** uint256(decimals)), 1080000000 * (10 ** uint256(decimals))];
