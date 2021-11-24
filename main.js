'use strict'

const config = {
    'CLITextInput': document.getElementById("CLITextInput"),
    'CLIOutputDiv': document.getElementById("CLIOutputDiv"),
}

class CommandNode{
    constructor(command){
        this.command = command;
        this.prev = null;
        this.next = null;
    }
}

class CommandHistory{
    constructor(){
        this.head = new CommandNode(null);
        this.tail = this.head;
        this.current = this.tail;
    }
    preview(){
        if(this.current === this.head){
            return this.current.command;

        }else{
            this.current = this.current.prev;

            return this.current.next.command;
        }

    }
    next(){
        if(this.current === this.tail){
            return this.current.command;
        }else{
            this.current = this.current.next;
            return this.current.prev.command;
        }
    }
    add(command){
        if(this.head.command === null){
            this.head = new CommandNode(command);
            this.tail = this.head;
        }else if(this.head.next === null){
            this.head.next = new CommandNode(command);
            this.tail = this.head.next;
            this.tail.prev = this.head;
        }else{
            this.tail.next = new CommandNode(command);
            this.tail.next.prev = this.tail;
            this.tail = this.tail.next;
        }

        //currentをリセット
        this.reset();

        return this.tail;
    }
    reset(){
        this.current = this.tail;
    }
    print(){
        let iterator = this.head;
        if(iterator.command === null){
            return;
        }

        let history = "";

        while(iterator !== null){
            history += iterator.command + " -> ";
            iterator = iterator.next;
        }

        console.log("command history is ..." + history);
        return history;
    }
    printReverse(){
        console.log("コマンド履歴は...");
        let iterator = this.tail;
        if(iterator.command === null){
            console.log("コマンド履歴はありません");
            return;
        }

        let history = "";

        while(iterator !== null){
            history += iterator.command + " -> ";
            iterator = iterator.prev;
        }

        console.log(history);
        return history;
    }

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
            // let parsedCLIArray = CCTools.commandLineParser(CLITextInput.value);

            // let result = CCTools.parsedArrayValidator(parsedCLIArray);

            // if(result["isValid"]){
            //     if(parsedCLIArray[1] === "showDenominations"){
            //         result["message"] = CCTools.showDenominations(parsedCLIArray[2]);

            //     }else if(parsedCLIArray[1] === "showAvailableLocales"){
            //         result["message"] = CCTools.showAvailableLocales();

            //     }else if(parsedCLIArray[1] === "convert"){
            //         result["message"] = CCTools.convert(parsedCLIArray[2], Number(parsedCLIArray[3]), parsedCLIArray[4]);
            //     }
            // }

            // View.appendResultParagraph(config.CLIOutputDiv, result["isValid"], result["message"]);

            //コマンドを履歴に追加
            history.add(config.CLITextInput.value);
            //inputをリセット
            config.CLITextInput.value = '';

            // 出力divを常に下方向にスクロールします。
            config.CLIOutputDiv.scrollTop = config.CLIOutputDiv.scrollHeight;
            history.print();

            //コマンド履歴
        }else if(event.key === "ArrowUp"){
            if(history.current !== null){
                config.CLITextInput.value = history.preview();
            }
        }else if(event.key === "ArrowDown"){
            if(history.current !== null){
                config.CLITextInput.value = history.next()
            }
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

class DirectoryNode{
    constructor(type, name){
        this.type = type;
        this.name = name;
        this.created = new Date();
        this.next = null;
    }

    setType(type){}
    getType(){}
    setName(name){}
    getName(){}
    getCreatedAt(){}
    setParent(DirectoryNode){}
    getParent(){}
}

class File extends DirectoryNode{
    constructor(type, name){
        super(type, name);
        this.content = null
    }
    setContent(content){}
    getContent(){}
}
class Directory extends DirectoryNode{}

class FileDirectorySystem{

    static supportCommand = ["touch", "mkdir", "ls", "cd", "pwd", "print", "setContent", "rm"];

    static touch(type, name){
        // 指定した名前でfile or dirを作成する。
    }
    static mkdir(dirName){}
    static ls(){}
    static cd(path){
        // cd .. -> current dir から親dirへ移動
        // cd dirName -> 指定したdirへ移動
    }
    static pwd(){
        //current dirの絶対pathを表示する
    }
    static print(fileName){}
    static setContent(content){}
    static rm(name){}

    // static commandLineParser(CLIInputString){
    //     //入力したコマンドを" "で分割し配列にする処理
    //     let parsedStringInputArray = CLIInputString.trim().split(" ");
    //     return parsedStringInputArray;
    // }

    // static parsedArrayValidator(parsedStringInputArray){
    //     // すべてのコマンドに適用されるルールに照らし合わせて入力をチェックする
    //     //universal validator
    //     let validatorResponse = CCTools.universalValidator(parsedStringInputArray);
    //     if(!validatorResponse["isValid"]) return validatorResponse;

    //     //command args validator
    //     let commandArgsArray = parsedStringInputArray.slice(1);
    //     validatorResponse = CCTools.commandArgumentsValidator(commandArgsArray);
    //     if(!validatorResponse["isValid"]) return validatorResponse;

    //     return validatorResponse;
    // }

    // static universalValidator(parsedStringInputArray){
    //     let universalValidatorResponse = {'isValid': true, 'message': ''};

    //     if(parsedStringInputArray[0] !== "CCTools"){
    //         //１番目のキーワードが "CCTools"であること
    //         universalValidatorResponse["isValid"] = false;
    //         universalValidatorResponse["message"] = "only CCTools package supported by this app. input must start with 'CCTools'";

    //     }else if(!CCTools.supportCommand.includes(parsedStringInputArray[1])){
    //         //2番目のワードがsupport commandに含まれていること
    //         universalValidatorResponse["isValid"] = false;
    //         universalValidatorResponse["message"] = "Not supported this command by this app. input must choice [convert], [showAvailableLocales], [showDenominations]";
    //     }

    //     return universalValidatorResponse;
    // }

    // static commandArgumentsValidator(commandArgsArray){
    //     let commandValidatorResponse = {'isValid': true, 'message': ''};

    //     if(commandArgsArray[0] === "showAvailableLocales"){
    //         //commandがshowAvailableLocalesの時は引数はなし
    //         if(commandArgsArray.length !== 1){
    //             commandValidatorResponse["isValid"] = false;
    //             commandValidatorResponse["message"] = `command :${commandArgsArray[0]} is NOT need Argments`;
    //         }
    //     }else if(commandArgsArray[0] === "showDenominations"){
    //         //commandがshowDenominationsの時
    //         if(!Object.keys(CCTools.exchangeRates).includes(commandArgsArray[1])){
    //             commandValidatorResponse["isValid"] = false;
    //             commandValidatorResponse["message"] = `command :${commandArgsArray[0]} NOT supported Locale. you should check Locale list`;
    //         }
    //     }else if(commandArgsArray[0] === "convert"){
    //         //convertの時
    //         let convertArgs = commandArgsArray.slice(1);
    //         let convertValidatorResponse = CCTools.convertValidator(convertArgs);

    //         if(!convertValidatorResponse["isValid"]){
    //             commandValidatorResponse["isValid"] = false;
    //             commandValidatorResponse["message"] = convertValidatorResponse["message"];
    //         }
    //     }

    //     return commandValidatorResponse;
    // }
    // static convertValidator(convertArgs){
    //     //3語であること
    //     //amountは数字であること
    //     //sourceの通貨とdestinationの通貨はexchangeに含まれていること
    //     let sourceDenomination = convertArgs[0];
    //     let destinationDenomination = convertArgs[2];
    //     let sourceAmount = Number(convertArgs[1]);
    //     let supportDenominations = CCTools.getSupportDenominations();

    //     let response = {
    //         "isValid": true,
    //         "message": `command :${convertArgs[0]} or ${convertArgs[2]} NOT supported Denominations. you should check Locale list`
    //     }

    //     if(convertArgs.length !== 3){
    //         response["isValid"] = false;
    //         response["message"] = "In case of convert Denominations, input must contain exactly 3 elements.[sourceDenomination] [sourceAmount] [destinationDenomination]"

    //     }else if(typeof(sourceAmount) !== "number" || isNaN(sourceAmount)){
    //         response["isValid"] = false;
    //         response["message"] = "source Amount is not number. You should input number."

    //     }else if(!supportDenominations.includes(sourceDenomination) || !supportDenominations.includes(destinationDenomination)){
    //         response["isValid"] = false;
    //         response["message"] = "NOT exist Denomination."
    //     }

    //     return response;
    // }

    static resultListMessage(keys){
        let resultMessage = "";

        for(let key of keys){
            resultMessage += key + ", ";
        }

        return resultMessage;
    }

}

// class CCTools{
//     static exchangeRates = {
//         "Japan": {
//             "Yen": 1
//         },
//         "India": {
//             "Rupee": 1.4442,
//             "Paisa": 0.014442
//         },
//         "USA": {
//             "Dollar": 106.10,
//             "USCent": 1.0610
//         },
//         "Europe": {
//             "Euro": 125.56,
//             "EuroCent": 1.2556
//         },
//         "UAE": {
//             "Dirham": 28.89,
//             "Fils": 0.2889
//         },
//     }

//     static supportCommand = ["convert", "showAvailableLocales", "showDenominations"]

//     static commandLineParser(CLIInputString){
//         //入力したコマンドを" "で分割し配列にする処理
//         let parsedStringInputArray = CLIInputString.trim().split(" ");
//         return parsedStringInputArray;
//     }

//     static parsedArrayValidator(parsedStringInputArray){
//         // すべてのコマンドに適用されるルールに照らし合わせて入力をチェックする
//         //universal validator
//         let validatorResponse = CCTools.universalValidator(parsedStringInputArray);
//         if(!validatorResponse["isValid"]) return validatorResponse;

//         //command args validator
//         let commandArgsArray = parsedStringInputArray.slice(1);
//         validatorResponse = CCTools.commandArgumentsValidator(commandArgsArray);
//         if(!validatorResponse["isValid"]) return validatorResponse;

//         return validatorResponse;
//     }

//     static universalValidator(parsedStringInputArray){
//         let universalValidatorResponse = {'isValid': true, 'message': ''};

//         if(parsedStringInputArray[0] !== "CCTools"){
//             //１番目のキーワードが "CCTools"であること
//             universalValidatorResponse["isValid"] = false;
//             universalValidatorResponse["message"] = "only CCTools package supported by this app. input must start with 'CCTools'";

//         }else if(!CCTools.supportCommand.includes(parsedStringInputArray[1])){
//             //2番目のワードがsupport commandに含まれていること
//             universalValidatorResponse["isValid"] = false;
//             universalValidatorResponse["message"] = "Not supported this command by this app. input must choice [convert], [showAvailableLocales], [showDenominations]";
//         }

//         return universalValidatorResponse;
//     }

//     static commandArgumentsValidator(commandArgsArray){
//         let commandValidatorResponse = {'isValid': true, 'message': ''};

//         if(commandArgsArray[0] === "showAvailableLocales"){
//             //commandがshowAvailableLocalesの時は引数はなし
//             if(commandArgsArray.length !== 1){
//                 commandValidatorResponse["isValid"] = false;
//                 commandValidatorResponse["message"] = `command :${commandArgsArray[0]} is NOT need Argments`;
//             }
//         }else if(commandArgsArray[0] === "showDenominations"){
//             //commandがshowDenominationsの時
//             if(!Object.keys(CCTools.exchangeRates).includes(commandArgsArray[1])){
//                 commandValidatorResponse["isValid"] = false;
//                 commandValidatorResponse["message"] = `command :${commandArgsArray[0]} NOT supported Locale. you should check Locale list`;
//             }
//         }else if(commandArgsArray[0] === "convert"){
//             //convertの時
//             let convertArgs = commandArgsArray.slice(1);
//             let convertValidatorResponse = CCTools.convertValidator(convertArgs);

//             if(!convertValidatorResponse["isValid"]){
//                 commandValidatorResponse["isValid"] = false;
//                 commandValidatorResponse["message"] = convertValidatorResponse["message"];
//             }
//         }

//         return commandValidatorResponse;
//     }
//     static convertValidator(convertArgs){
//         //3語であること
//         //amountは数字であること
//         //sourceの通貨とdestinationの通貨はexchangeに含まれていること
//         let sourceDenomination = convertArgs[0];
//         let destinationDenomination = convertArgs[2];
//         let sourceAmount = Number(convertArgs[1]);
//         let supportDenominations = CCTools.getSupportDenominations();

//         let response = {
//             "isValid": true,
//             "message": `command :${convertArgs[0]} or ${convertArgs[2]} NOT supported Denominations. you should check Locale list`
//         }

//         if(convertArgs.length !== 3){
//             response["isValid"] = false;
//             response["message"] = "In case of convert Denominations, input must contain exactly 3 elements.[sourceDenomination] [sourceAmount] [destinationDenomination]"

//         }else if(typeof(sourceAmount) !== "number" || isNaN(sourceAmount)){
//             response["isValid"] = false;
//             response["message"] = "source Amount is not number. You should input number."

//         }else if(!supportDenominations.includes(sourceDenomination) || !supportDenominations.includes(destinationDenomination)){
//             response["isValid"] = false;
//             response["message"] = "NOT exist Denomination."
//         }

//         return response;
//     }
//     static getSupportDenominations(){
//         let denominations = [];
//         let locales = Object.keys(CCTools.exchangeRates);

//         //要リファクタリング
//         for(let locale of locales){
//             for(let denomination of Object.keys(CCTools.exchangeRates[locale])){
//                 denominations.push(denomination);
//             }
//         }

//         return denominations;
//     }

//     static resultListMessage(keys){
//         let resultMessage = "";

//         for(let key of keys){
//             resultMessage += key + ", ";
//         }

//         return resultMessage;
//     }

//     static showAvailableLocales(){
//         //引数は受け取らず、変換するための利用可能なロケールのリストを表示。
//         return CCTools.resultListMessage(Object.keys(CCTools.exchangeRates));
//     }

//     static showDenominations(locale){
//         //引数：利用可能なlocale
//         //そのロケールでサポートされているデノミテーション（通貨の単位）のリスト。
//         return CCTools.resultListMessage(Object.keys(CCTools.exchangeRates[locale]));
//     }

//     static convert(sourceDenomination, sourceAmount, destinationDenomination){
//         //引数:変換前の通貨の単位、通貨量、変換先の通貨の単位
//         //通貨を変換し、入力と出力の値、通貨単位を表示します。sourceAmountは数値に変換される必要があります。
//         let sourceRate = 0;
//         let destinationRate = 0;

//         let locales = Object.keys(CCTools.exchangeRates);

//         for(let key of locales){
//             let denominations = Object.keys(CCTools.exchangeRates[key]); //通過単位を配列で取得

//             denominations.find(denomination => {
//                 if(denomination === sourceDenomination){
//                     //変換前のレート
//                     sourceRate = CCTools.exchangeRates[key][denomination];
//                 }
//                 else if(denomination === destinationDenomination){
//                     //変換先のレート
//                     destinationRate = CCTools.exchangeRates[key][denomination];
//                 }
//             })
//         }

//         return Math.floor(sourceAmount * (sourceRate / destinationRate));
//     }

// }

const history = new CommandHistory();
Controller.initialize();