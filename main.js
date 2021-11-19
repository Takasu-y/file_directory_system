'use strict'

const config = {
    'CLITextInput': document.getElementById("CLITextInput"),
    'CLIOutputDiv': document.getElementById("CLIOutputDiv"),
}


class Controller{
    //modelとviewをつなぐ機能を記述
    static initialize(){
        config.CLITextInput.addEventListener("keyup", (event)=>Controller.submitSearch(event));
    }
    static submitSearch(event){
        if (event.key =="Enter"){
            //入力コマンドを画面に表示
            View.appendEchoParagraph(config.CLIOutputDiv);

            //入力を配列に解析
            let parsedCLIArray = CCTools.commandLineParser(CLITextInput.value);
            // console.log(parsedCLIArray);
            let resultMessage = "";

            if(parsedCLIArray[1] === "showDenominations"){
                resultMessage = CCTools.showDenominations(parsedCLIArray[2]);

            }else if(parsedCLIArray[1] === "showAvailableLocales"){
                resultMessage = CCTools.showAvailableLocales();

            }else if(parsedCLIArray[1] === "convert"){
                resultMessage = CCTools.convert(parsedCLIArray[2], Number(parsedCLIArray[3]), parsedCLIArray[4]);
            }





            // 入力の検証を行い、 {'isValid': <Boolean>, 'errorMessage': <String>} の形をした連想配列を作成します。
            // let validatorResponse = CCTools.parsedArrayValidator(parsedCLIArray);
            // if(validatorResponse['isValid'] == false) Controller.appendResultParagraph(CLIOutputDiv, false, validatorResponse['errorMessage']);

            // else Controller.appendResultParagraph(CLIOutputDiv, true, CCTools.evaluatedResultsStringFromParsedCLIArray(parsedCLIArray));

            //結果を出力
            let result = {
                "isValid": true,
                "message": resultMessage
            }

            // View.appendResultParagraph(config.CLIOutputDiv, true, "Hello");
            View.appendResultParagraph(config.CLIOutputDiv, result["isValid"], result["message"]);

            //inputをリセット
            config.CLITextInput.value = '';

            // 出力divを常に下方向にスクロールします。
            config.CLIOutputDiv.scrollTop = config.CLIOutputDiv.scrollHeight;
        }
    }

}


class View{
    static appendEchoParagraph(parentDiv){
        //入力結果を親要素に追加
        parentDiv.innerHTML+=
            `<p class="m-0">
                <span style='color:green'>student</span>
                <span style='color:magenta'>@</span>
                <span style='color:blue'>recursionist</span>
                : ${config.CLITextInput.value}
            </p>`;

        return;
    }
    static appendResultParagraph(parentDiv, isValid, message){
        //親要素にvalidate結果と出力結果のmessageを追加
        let promptName = "";
        let promptColor = "";
        if (isValid){
            promptName = "CCTools";
            promptColor = "turquoise";
        }
        else{
            promptName = "CCToolsError";
            promptColor = "red";
        }
        parentDiv.innerHTML+=
                `<p class="m-0">
                    <span style='color: ${promptColor}'>${promptName}</span>: ${message}
                </p>`;
        return;
    }
}



class CCTools{
    static exchangeRates = {
        "Japan": {
            "Yen": 1
        },
        "India": {
            "Rupee": 1.4442,
            "Paisa": 0.014442
        },
        "USA": {
            "Dollar": 106.10,
            "USCent": 1.0610
        },
        "Europe": {
            "Euro": 125.56,
            "EuroCent": 1.2556
        },
        "UAE": {
            "Dirham": 28.89,
            "Fils": 0.2889
        },
    }

    static commandLineParser(CLIInputString){
        //入力したコマンドを" "で分割し配列にする処理
        let parsedStringInputArray = CLIInputString.trim().split(" ");
        // console.log(parsedStringInputArray);
        return parsedStringInputArray;
    }


    // static parsedArrayValidator(parsedStringInputArray){
    //     // すべてのコマンドに適用されるルールに照らし合わせて入力をチェックする
    //     let validatorResponse = CCTools.universalValidator(parsedStringInputArray);
    //     if (!validatorResponse['isValid']) return validatorResponse;

    //     // 入力が最初のvalidatorを通過した場合、どのコマンドが与えられたかに基づいて、より具体的な入力の検証を行います。
    //     validatorResponse = CCTools.commandArgumentsValidator(parsedStringInputArray.slice(1,3));
    //     if (!validatorResponse['isValid']) return validatorResponse;

    //     return {'isValid': true, 'errorMessage':''}
    // }


    // static universalValidator(parsedStringInputArray){

    //     return {'isValid': true, 'errorMessage': ''}
    // }

    // static commandArgumentsValidator(commandArgsArray){

    //     let argsArray = commandArgsArray[1].split(",").map(stringArg=>Number(stringArg))

    //     // 与えられたコマンドが単一の引数を必要とする場合、コマンドと引数をsingle argument validatorに渡します。
    //     if (singleArgumentCommands.indexOf(commandArgsArray[0]) != -1){
    //         return CCTools.singleArgValidator(commandArgsArray[0], argsArray);
    //     }

    //     // 与えられたコマンドが2つの引数を必要とする場合、コマンドと引数をdouble argument validatorに渡します。
    //     if (doubleArgumentCommands.indexOf(commandArgsArray[0]) != -1){
    //         return CCTools.doubleArgValidator(commandArgsArray[0], argsArray);
    //     }
    // }

    static resultListMessage(keys){
        let resultMessage = "";

        for(let key of keys){
            resultMessage += key + ", ";
        }

        return resultMessage;
    }

    static showAvailableLocales(){
        //引数は受け取らず、変換するための利用可能なロケールのリストを表示します。
        return CCTools.resultListMessage(Object.keys(CCTools.exchangeRates));
    }

    static showDenominations(locale){
        //引数：利用可能なlocale
        //そのロケールでサポートされているデノミテーション（通貨の単位）のリストを表示します。
        return CCTools.resultListMessage(Object.keys(CCTools.exchangeRates[locale]));
    }

    static convert(sourceDenomination, sourceAmount, destinationDenomination){
        //引数:変換前の通貨の単位、通貨量、変換先の通貨の単位
        //通貨を変換し、入力と出力の値、通貨単位を表示します。sourceAmountは数値に変換される必要があります。
        let sourceRate = 0;
        let destinationRate = 0;

        let country = Object.keys(CCTools.exchangeRates);

        for(let key of country){
            let denominations = Object.keys(CCTools.exchangeRates[key]); //通過単位を配列で取得

            denominations.find(denomination => {
                if(denomination === sourceDenomination){
                    //変換前のレート
                    sourceRate = CCTools.exchangeRates[key][denomination];
                }
                else if(denomination === destinationDenomination){
                    //変換先のレート
                    destinationRate = CCTools.exchangeRates[key][denomination];
                }
            })
        }

        return Math.floor(sourceAmount * (sourceRate / destinationRate));
    }

}

Controller.initialize();
// console.log(CCTools.exchangeRates);
// console.log(CCTools.showAvailableLocales());
// console.log(CCTools.showDenominations("USA"));
// console.log(CCTools.convert("Dollar", 5, "Yen"));
// console.log(CCTools.convert("Euro", 100, "Dollar"));