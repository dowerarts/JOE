const readlineSync = require("readline-sync");
const fs = require("fs");
var fetch = require("node-fetch");
var chalk = require("chalk");
var moment = require('moment');
const {
    log
} = require("console");
const delay = require('delay');
const {
    get
} = require("https");
const {
    table
} = require('table');
const FormData = require('form-data');
const axios = require('axios');
const qr = require('qrcode-terminal');
const {
    decode
} = require("html-entities");
const {
    parse
} = require("path");

function report(cookie, shopid, itemid, description) {
    const index = fetch('https://shopee.co.id/api/v4/listing_qc/item_report/report_item', {
            method: 'POST',
            headers: {
                'Host': 'shopee.co.id',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0',
                'Accept': 'application/json',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'X-Shopee-Language': 'id',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Source': 'pc',
                'Af-Ac-Enc-Dat': '8afb9094a3bfd66c',
                'X-Sz-Sdk-Version': '1.12.19',
                'Origin': 'https://shopee.co.id',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Priority': 'u=0',
                'Te': 'trailers',
                'Content-Length': '93',
                'Cookie': cookie
            },
            body: JSON.stringify({
                'reason_id': 1064,
                'item_id': parseInt(itemid),
                'shop_id': parseInt(shopid),
                'description': `barandn`
            })
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function getProfile(cookie) {
    const index = fetch('https://seller.shopee.co.id/api/v2/login/', {
            headers: {
                'Host': 'seller.shopee.co.id',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sc-Fe-Session': '008BFA27D8070C07',
                'Accept': 'application/json, text/plain, */*',
                'Sc-Fe-Ver': '21.69101',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                'Sec-Ch-Ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://seller.shopee.co.id/portal/sale/shipment?type=toship&source=processed',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Priority': 'u=1, i',
                'Cookie': cookie
            }
        })

        .then(async (res) => {
            const headers = res.json()

            return headers;
        });

    return index;
}

(async () => {
    if (fs.existsSync('loginShopee.json')) {} else {
        fs.appendFileSync("loginPlugo.loginShopee", '[]');
    }
    console.log(`    List Account Login`)
    console.log()
    var configData = fs.readFileSync(`loginShopee.json`);
    var config = JSON.parse(configData)
    const detect = config;
    const totalAccount = config.length;
    let tableData = [
        ['id', 'ID', 'Username', 'Shop ID']
    ];
    const configTable = {
        columns: [{
            alignment: 'center'
        }, {
            alignment: 'center'
        }, {
            alignment: 'center'
        }]
    };

    for (let index = 0; index < totalAccount; index++) {
        const cookie = detect[index].cookieAccount;
        const logon = await getProfile(cookie);
        try {
            var id = logon.id
            var username = logon.username
            var shopid = logon.shopid
        } catch (err) {
            console.log(err)
            var id = "Account Not Login";
            var username = "Account Not Login";
            var shopid = "Account Not Login";
        }

        tableData.push([index, chalk.green(id), username, chalk.yellow(shopid)])
    }
    console.log(table(tableData, configTable))

    console.log('[1] ' + chalk.green('Shopee Input Cookie'))
    console.log('[2] ' + chalk.green('Shopee Report Product'))
    console.log()
    var pilihan = readlineSync.question('[!] Vote?? ')
    console.log()
    if (pilihan == 1) {
        const voteGetting = readlineSync.question('[!] Login Cookie [ y ] / Delete Account [ n ] : ');

        if (voteGetting.toLowerCase() == "y") {
            console.log()
            const read2 = fs.readFileSync('cookie.txt', 'UTF-8');
            const list2 = read2.split(/\r?\n/);
            for (var i = 0; i < list2.length; i++) {
                var cookieinput = list2[i].split('|')[0];
                const arrayPush = detect.push({
                    cookieAccount: cookieinput,
                });
                const testlistJson = JSON.stringify(detect);
                fs.unlinkSync(`loginShopee.json`)

                fs.appendFileSync(`loginShopee.json`, testlistJson);
                console.log(chalk.green('    Successfully input cookie'))
            }
        } else if (voteGetting.toLowerCase() == "n") {
            console.log()
            var nomor = readlineSync.question("[+] Akun Number : ");
            const deletez = delete detect[nomor]
            var hasil = detect.filter(function (a) {
                return typeof a !== 'undefined';
            });
            const testlistJson = JSON.stringify(hasil);
            fs.unlinkSync('loginShopee.json')

            fs.appendFileSync("loginShopee.json", testlistJson);
            console.log(chalk.white('[') + chalk.green(`!`) + chalk.white(']') + ` Information  => ` + chalk.yellow(`Successfully Delete Account`))
        }
    } else if (pilihan == 2) {
        const description = readlineSync.question('[!] Description  : ')
        const read2 = fs.readFileSync('link.txt', 'UTF-8');
        const list2 = read2.split(/\r?\n/);
        for (var i = 0; i < list2.length; i++) {
            var link = list2[i].split('|')[0];
            const parts = link.split("i.")[1].split(".");
            const shopidReport = parts[0];
            const itemid = parts[1];
            var product_slug = link.split('/')[3].split('.')[0]
            var name = product_slug.replace(/-/g, ' ');

            for (let index2 = 0; index2 < totalAccount; index2++) {
                var cookie = detect[index2].cookieAccount;
                console.log()
                const cookieData = cookie;

                const logon = await getProfile(cookieData);
                try {
                    var username = logon.username
                    var shopidseller = logon.shopid
                } catch (err) {
                    console.log(`\n${chalk.red(`[ERROR]`)} ${chalk.yellow(`Cookie Invalid`)}`);
                    process.exit(0);
                }
                console.log(`\n${chalk.green(`[INFO]`)} ${chalk.yellow(`Welcome back, ${username}`)} [ ${chalk.green(moment().format('HH:mm:ss'))} ]`);
                console.log(`\n${chalk.green(`[ITEMID]`)} ${chalk.yellow(`${itemid}`)}`);
                console.log(`${chalk.green(`[SHOPID]`)} ${chalk.yellow(`${shopidReport}`)}`);
                console.log(`${chalk.green(`[NAME]`)} ${chalk.yellow(`${name}`)}`);

                const reporting = await report(cookie, shopidReport, itemid, description)
                try {
                    var errormsg = reporting.error_msg;
                    if (errormsg.length > 10) {
                        console.log(`${chalk.red(`[ERROR]`)} ${chalk.yellow(`${errormsg}`)}`);
                    }
                    process.exit(0)
                } catch (err) {

                }

                if (reporting.bff_meta == null || reporting.error == null || reporting.error_msg == null) {
                    console.log(`${chalk.yellow(`[STATUS]`)} ${chalk.green(`Successfully Report`)} ${chalk.yellow(name)}`);
                    console.log(`${chalk.yellow(`[DESC]`)} ${chalk.green(`${description}`)}`);
                    console.log(`${chalk.yellow(`[TYPE]`)} ${chalk.green(`Menjual produk dilarang lainnya`)}`);
                }
            }
        }
    }
})();