'use strict'


/*
DESIGN CHOICES:
    - 入力文字列を空白で分割して文字列の配列に変換します。
    - この文字列の入力配列には、3つの要素 パッケージ名 コマンド 引数が含まれる必要があります。
    - parsedStringInputArrayが有効な場合は、専用ハンドラに渡して適切な組み込みJSを実行し、文字列のレスポンスを生成します。
    - 入力の検証を2つのステップに分けます: すべてのコマンドを対象とした検証と、特定のコマンドを対象とした入力の検証です。
    - 入力が有効でない場合は、エラーメッセージを生成して、ユーザーが別の方法でどうすれば良いかを伝えます。
    - ハンドラから情報を受け取り、CLIOutputDivにDOMparagraphを追加する、専用のビュー関数で生成されるレスポンス
*/



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
            // let parsedCLIArray = CCTools.commandLineParser(CLITextInput.value);
            View.appendEchoParagraph(config.CLIOutputDiv);

            config.CLITextInput.value = '';

            //結果を出力
            View.appendResultParagraph(config.CLIOutputDiv, true, CCTools.showDenominations("USA"));
            View.appendResultParagraph(config.CLIOutputDiv, true, CCTools.showAvailableLocales());

            // 入力の検証を行い、 {'isValid': <Boolean>, 'errorMessage': <String>} の形をした連想配列を作成します。
            // let validatorResponse = CCTools.parsedArrayValidator(parsedCLIArray);
            // if(validatorResponse['isValid'] == false) Controller.appendResultParagraph(CLIOutputDiv, false, validatorResponse['errorMessage']);

            // else Controller.appendResultParagraph(CLIOutputDiv, true, CCTools.evaluatedResultsStringFromParsedCLIArray(parsedCLIArray));

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

    // static commandLineParser(CLIInputString){
    //     //入力したコマンドを" "で分割し配列にする処理
    //     let parsedStringInputArray = CLIInputString.trim().split(" ");
    //     console.log(parsedStringInputArray);
    //     return parsedStringInputArray;
    // }


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

    static showAvailableLocales(){
        //引数は受け取らず、変換するための利用可能なロケールのリストを表示します。
        let resultMessage = "";
        let keys = Object.keys(CCTools.exchangeRates);

        for(let key of keys){
            resultMessage += key + ", ";
        }

        return resultMessage;
    }

    static showDenominations(locale){
        //引数：利用可能なlocale
        //そのロケールでサポートされているデノミテーション（通貨の単位）のリストを表示します。
        let resultMessage = "";
        let keys = Object.keys(CCTools.exchangeRates[locale]);

        for(let key of keys){
            resultMessage += key + ", ";
        }

        return resultMessage;
    }

    static convert(sourceDenomination, sourceAmount, destinationDenomination){
        //引数:変換前の通貨の単位、通貨量、変換先の通貨の単位
        //通貨を変換し、入力と出力の値、通貨単位を表示します。sourceAmountは数値に変換される必要があります。
    }

}

Controller.initialize();
console.log(CCTools.exchangeRates);
console.log(CCTools.showAvailableLocales());
console.log(CCTools.showDenominations("USA"));