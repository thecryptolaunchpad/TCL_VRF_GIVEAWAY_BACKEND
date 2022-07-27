const express = require('express')
Web3 = require('web3')
const {
	ethers
} = require("ethers");
const app = express()
const port = 3030
require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;
const secretKey = process.env.SECRET_KEY;
var contractFMCNew = process.env.CONTRACT;
var AbiFMCNew = process.env.CONTRACT_ABI;
const providerAddress = process.env.RPC_URL;
const ethersprovider = new ethers.providers.JsonRpcProvider(providerAddress);
//New config
const adminAccountNew = new ethers.Wallet(privateKey, ethersprovider);
const tokenNew = new ethers.Contract(contractFMCNew, AbiFMCNew);
const adminsignedTokenContractNew = tokenNew.connect(adminAccountNew);

//const mysql = require('mysql');

// //MySQL details
// var mysqlConnection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: '',
// 	database: 'test_db',
// 	multipleStatements: true
// });

// mysqlConnection.connect((err) => {
// 	if (!err)
// 		console.log('Connection Established Successfully');
// 	else
// 		console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
// });


app.get('/getContests', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setTimeout(120000, function() {
		console.log('Request has timed out.');
		res.status(500).send('Response Processing Timed Out.');

	});
	const contests = await adminsignedTokenContractNew.getContests();
	var resp = [];
	contests.forEach(result => {
		var Contest = {};
		Contest.contestName = result[0];
		Contest.numberOfWinners= result[1];
		Contest.contestants_addresses = result[2];
		var Winners = [];
		var contestants = [];
		result[2].forEach(c=>{
			contestants.push(c);
		});

		result[3].forEach(winner=>{
			var win = ""+winner;
			var winnerIndex = (win % contestants.length);
			Winners.push(contestants[winnerIndex]);
			contestants.splice(winnerIndex,1);
		});
		Contest.winners = Winners;
		Contest.announcementDate = ""+result[4];
		Contest.finished = result[5];
		Contest.imageUrl = result[6];
		Contest.prizeWorth =""+result[7];
		console.log("------------------------")
		console.log(Contest)
		resp.push(Contest);
	});
	console.log("**************************************");
	console.log(resp);
	return res.status(200).send(resp);
})

app.get('/', async (req, res) => {
	res.send('Server is running on port :' + port);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
