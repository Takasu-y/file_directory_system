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

        // console.log("command history is ..." + history);
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
            let parsedCLIArray = FDSystem.commandLineParser(CLITextInput.value);
            let command = parsedCLIArray[0];

            let path;
            let name;
            let args = [];

            if(parsedCLIArray.length > 1){
                path = parsedCLIArray[1].split("/").slice(0,-1);
                name = parsedCLIArray[1].split("/").slice(-1)[0];
                args.push(name);
            }

            if(parsedCLIArray.length > 2){
                let arr = parsedCLIArray.slice(2);
                let message = arr.reduce((result, text) => result + " " + text);
                args.push(message);
            }

            /////////////////////////////////////////////////////
            let result = FDSystem.parsedArrayValidator(command, path, args);
            if(result["isValid"]){
                result["message"] = FDSystem.funcCommand(command, args);
            }
            /////////////////////////////////////////////////////


            View.appendResultParagraph(config.CLIOutputDiv, result["isValid"], result["message"]);

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
                <span style='color:aqua'>student</span>
                <span style='color:aquamarine'>@</span>
                <span style='color:aqua'>recursionist</span>
                <span style='color:gray'>${FDSystem.currentDirectory.name}</span>
                : ${config.CLITextInput.value}
            </p>`;

        return;
    }
    static appendResultParagraph(parentDiv, isValid, message){
        //親要素にvalidate結果と出力結果のmessageを追加
        let promptName = "";
        let promptColor = "";
        if (isValid){
            promptName = "FDSystem";
            promptColor = "lime";
        }
        else{
            promptName = "Error";
            promptColor = "red";
        }
        parentDiv.innerHTML+=
                `<p class="m-0">
                    <span style='color: ${promptColor}'>${promptName}</span>: ${message}
                </p>`;
        return;
    }
}

class SinglyLinkedList{
    constructor(){
        this.head = null;
    }

    print(){
        let text = "";
        let iterator = this.head;
        while(iterator !== null){
            text += iterator.getName() + " | ";
            iterator = iterator.next;
        }

        return text;
    }
    search(name){
        //nameに一致するオブジェクトを返す
        let iterator = this.head;
        while(iterator !== null){
            if(iterator.name === name){
                return iterator;
            }
            iterator = iterator.next;
        }
        return;
    }
    add(Node){
        if(this.head === null) return this.head = Node;

        let iterator = this.head;
        while(iterator.next !== null){
            iterator = iterator.next;
        }

        iterator.next = Node;

        return;
    }
    remove(name){
        //headが削除したいノードの場合
        if(this.head.name === name){
            let tmp = this.head;
            this.head = this.head.next;
            return tmp.name;
        }

        let iterator = this.head;

        //削除したいノードの次がnullの場合/nullじゃない場合
        while(iterator.next !== null){
            if(iterator.next.name === name){
                let tmp = iterator.next;

                if(iterator.next.next !== null){
                    iterator.next = iterator.next.next;
                }else{
                    iterator.next = null;
                }
                return tmp.name;
            }

            iterator = iterator.next;
        }
        return;
    }
}
class BaseNode{
    constructor(type, name){
        this.type = type;
        this.name = name;
        this.created = new Date();
        this.updated = this.created;
        this.parent = null;
        this.next = null;
    }

    getType(){
        return this.type;
    }
    setName(name){
        //nameを変更する時に使用する
        this.name = name;
        return;
    }
    getName(){
        return this.name;
    }
    getCreatedAt(){
        return this.created;
    }
    setUpdatedAt(){
        this.updated = new Date();
        return;
    }
    setParent(currentDirectory){
        //current directoryをparentにsetする
        this.parent = currentDirectory;
        return;
    }
    getParent(){
        return this.parent;
    }
}

class FileNode extends BaseNode{
    constructor(name){
        super("file", name);
        this.content = "NO DATA"
    }
    setContent(content){
        this.content = content;
        return;
    }
    getContent(){
        return this.content;
    }
}

class DirectoryNode extends BaseNode{
    constructor(name){
        super("directory", name);
        this.singlyLinkedList = new SinglyLinkedList()
    }
}

class FileDirectorySystem{

    constructor(){
        this.root = new DirectoryNode("root");
        this.currentDirectory = this.root;
        this.directoryList = [];
    }

    fileType = ["directory", "file"];
    commandList = ["touch", "mkdir", "ls", "cd", "pwd", "print", "setContent", "rm", "help"]

    commandLineParser(CLIInputString){
        //入力したコマンドを" "で分割し配列にする処理
        let parsedStringInputArray = CLIInputString.trim().split(" ");
        return parsedStringInputArray;
    }

    // parsedArrayValidator(parsedStringInputArray){
    parsedArrayValidator(command, pass, args){
        // すべてのコマンドに適用されるルールに照らし合わせて入力をチェックする
        //universal validator
        let validatorResponse =  FDSystem.universalValidator(command);
        if(!validatorResponse["isValid"]) return validatorResponse;

        //command args validator
        validatorResponse = FDSystem.commandArgumentsValidator(command, pass, args);
        if(!validatorResponse["isValid"]) return validatorResponse;

        return validatorResponse;
    }

    universalValidator(command){
        //一番目のキーワードがコマンドリストにあること
        let universalValidatorResponse = {'isValid': true, 'message': ''};

        if(!this.commandList.includes(command)){
            universalValidatorResponse["isValid"] = false;
            universalValidatorResponse["message"] = "入力されたコマンドはサポートされていません";
        }

        return universalValidatorResponse;
    }

    commandArgumentsValidator(command, path, args){
        let commandValidatorResponse = {'isValid': true, 'message': ''};

        console.log("command: " + command);
        console.log(path);
        console.log(args);



        //現在のディレクトリの参照を保存
        const currentDir = this.currentDirectory;

        //current directoryをターゲットのディレクトリに移動する
        if(path !== undefined){
            if(path[0] === ""){
                //絶対パス
                path = path.slice(1);
                this.currentDirectory = this.root;
            }

            //this.currentをpathを元に進めていく
            path.forEach(element => {
                let searchNode = this.currentDirectory.singlyLinkedList.search(element);

                if(searchNode !== undefined){
                    this.currentDirectory = searchNode;
                    console.log("カレントディレクトリを移動しました --> " + searchNode.name);
                }else{
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "カレントディレクトリの変更に失敗しました"
                }
            });
        }

        let name = args[0];

        //current directory内で対象のnameを検索
        let searchNode = this.currentDirectory.singlyLinkedList.search(name);

        switch(command){
            case 'touch':
                if(args.length !== 1){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "touchコマンドは引数を1つにしてください";

                }else if(searchNode !== undefined){
                    this.currentDirectory.setUpdatedAt();
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = `カレントディレクト内にファイル名 ${searchNode.name} と同一のディレクトリまたはファイルが存在します`;
                }
                break;

            case 'mkdir':
                if(args.length !== 1){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "mkdirコマンドは引数を1つにしてください";

                }else if(this.directoryList.includes(name)){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathはファイルシステムに既に存在するノードを参照してはいけません。";
                }
                break;

            case 'ls':
                if(name !== undefined && searchNode === undefined){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathはファイルシステム内に存在するノードを指す必要があります。";
                }
                break;

            case 'cd':
                if(args.length !== 1){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "cdコマンドは引数を1つにしてください";

                }else if(!this.directoryList.includes(name) && name !== ".."){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathはファイルシステム内に存在するノードを指す必要があります";

                }else if(searchNode !== undefined && searchNode.type === "file"){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathは'dir'型のノードを参照する必要があります。";
                }
                break;

            case 'pwd':
                if(args.length !== 0){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "pwdコマンドは引数を入力しないでください";
                }
                break;

            case 'print':
                if(searchNode === undefined){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathはファイルシステム内に存在するノードを指す必要があります。";

                }else if(searchNode.type !== "file"){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathは'file'型のノードを参照する必要があります。";
                }
                break;

            case 'setContent':
                if(searchNode === undefined){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathはファイルシステム内に存在するノードを指す必要があります。";

                }else if(searchNode.type !== "file"){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathは'file'型のノードを参照する必要があります。";
                }
                break;

            case 'rm':
                if(searchNode === undefined){
                    commandValidatorResponse["isValid"] = false;
                    commandValidatorResponse["message"] = "filePathはファイルシステム内に存在するノードを指す必要があります。";
                }
                break;
        }

        //current dirを戻す
        this.currentDirectory = currentDir;

        return commandValidatorResponse;
    }

    funcCommand(command, args){
        switch(command){
            case 'touch': return this.touch(args[0]);
            case 'mkdir': return this.mkdir(args[0]);
            case 'ls': return this.ls(args[0]);
            case 'cd': return this.cd(args[0]);
            case 'pwd': return this.pwd();
            case 'print': return this.print(args[0]);
            case 'setContent': return this.setContent(args[0], args[1]);
            case 'rm': return this.rm(args[0]);
            case 'help': return this.help();
        }
    }
    runCommand(path, command, args){
        /*
            各コマンドはcurrent directoryに対して処理を行う
            処理する前にcurrent dirの参照を変数に保存しておく
            current dirをtarget dirまで移動
            コマンド実行
            curret dirを初期の参照に戻す
        */

        const currentDir = this.currentDirectory;

        //current directoryからtarget directoryまで移動
        this.currentDirectory = this.change(path);
        let message =this.funcCommand(command, args);

        //current directoryを元に戻す
        this.currentDirectory = currentDir;

        return message;
    }
    touch(name){
        // 指定した名前でfileを作成する。
        // file or directoryに同じ名前がある場合はnodeの日時を更新する
        let newFile = new FileNode(name);
        newFile.setParent(this.currentDirectory);
        this.currentDirectory.singlyLinkedList.add(newFile);

        return `ファイル名 ${name} の作成に成功しました`;
    }
    mkdir(dirName){
        //directory作成
        let newDirectory = new DirectoryNode(dirName);
        newDirectory.setParent(this.currentDirectory);

        this.currentDirectory.singlyLinkedList.add(newDirectory);
        this.directoryList.push(dirName);

        return `フォルダ名 ${dirName} の作成に成功しました`;
    }
    ls(name){
        //引数なし -> current directoryの全てのファイルリストを出力
        //targetがdirectory -> target directory直下のファイル全て
        //targetがfileNode -> そのfileNodeのみを出力

        if(name === undefined) return this.currentDirectory.singlyLinkedList.print();

        //current directory内でnameと一致するnodeを検索
        let searchNode = this.currentDirectory.singlyLinkedList.search(name);

        //nameが見つからない場合
        if(searchNode === undefined) return "対象のファイルが存在しません";

        if(searchNode.type === "directory"){
            return searchNode.singlyLinkedList.print();
        }else{
            return searchNode.getName();
        }
    }
    cd(dirName){
        // cd .. -> current dir から親dirへ移動
        // cd dirName -> 指定したdirへ移動

        if(dirName === ".."){
            this.currentDirectory = this.currentDirectory.parent;
        }

        return `カレントディレクトを ${this.currentDirectory.name} へ変更しました`;
    }
    pwd(){
        //current dirの絶対pathを表示する
        let iterator = this.currentDirectory;

        let path = "/";
        while(iterator !== null){
            path = "/" + iterator.name + path;
            iterator = iterator.parent;
        }
        return path;
    }
    print(fileName){
        //current directory内の指定されたfile nameのcontentを出力
        //current directory内でnameと一致するnodeを検索
        let searchFile = this.currentDirectory.singlyLinkedList.search(fileName);

        //nameが見つからない場合
        if(searchFile === undefined) return "対象のファイルが存在しません";

        return searchFile.getContent();
    }
    setContent(fileName, content){
        //指定したfile nameのcontent内容を書き換える
        //current directory内でnameと一致するnodeを検索
        this.currentDirectory.singlyLinkedList.search(fileName).setContent(content);
        return `${fileName}の情報を変更しました。 content: ${content}`;
    }
    rm(name){
        let searchFile = this.currentDirectory.singlyLinkedList.search(name);

        //directoryの場合
        if(searchFile.type === "directory"){
            this.directoryList = this.directoryList.filter(name => name !== searchFile.name);
        }

        //指定したnameをcurrent directoryから削除
        this.currentDirectory.singlyLinkedList.remove(name);
        return `${name} をカレントディレクトリから削除しました`;
    }
    help(){
        return this.commandList.reduce((helpMsg, command) => helpMsg + " " + command);
    }
}



const history = new CommandHistory();
//File directory systemのインスタンスを作成
const FDSystem = new FileDirectorySystem();
Controller.initialize();



/// TEST /////////////////////////////////////////////////
// let input = "touch mkfile.txt";
// let input = "ls ";
// let input = "touch dir1/dir2/mkfile.txt";
// let parser = input.split(" ");
// let arg = parser[1];
// let pathParser = parser[1].split("/");


// let path = pathParser.slice(0, -1);
// let nm = pathParser.slice(-1)[0];

// console.log(parser);
// console.log(pathParser);

// console.log(path);
// console.log(nm);