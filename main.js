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
            let argsArr = parsedCLIArray.slice(1);

            let isValid = FDSystem.commandList.includes(command);

            // FDSystem.funcCommand(command, argsArr);


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

            View.appendResultParagraph(config.CLIOutputDiv, isValid, FDSystem.funcCommand(command, argsArr));

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
    }

    fileType = ["directory", "file"];
    commandList = ["touch", "mkdir", "ls", "cd", "pwd", "print", "setContent", "rm", "help"]

    commandLineParser(CLIInputString){
        //入力したコマンドを" "で分割し配列にする処理
        let parsedStringInputArray = CLIInputString.trim().split(" ");
        return parsedStringInputArray;
    }

    funcCommand(command, args){
        // 引数の数で分岐
        switch(command){
            case 'touch': return this.touch(args[0]);
            case 'mkdir': return this.mkdir(args[0]);
            case 'ls': return this.ls(args[0]);
            case 'cd': return this.cd(args[0]);
            case 'pwd': return this.pwd();
            case 'print': return this.print(args[0]);
            case 'setContent': return this.setContent(args[0], args.slice(1).reduce((result, text) => result + " " + text));
            case 'rm': return this.rm(args[0]);
            case 'help': return this.help();
            default: return "入力されたコマンドは存在しません";
        }
    }

    touch(name){
        // 指定した名前でfileを作成する。
        // file or directoryに同じ名前がある場合はnodeの日時を更新する
        let searchNode = this.currentDirectory.singlyLinkedList.search(name);
        if(searchNode !== undefined){
            this.currentDirectory.setUpdatedAt();
            return `カレントディレクト内にファイル名 ${searchNode.name} と同一のディレクトリまたはファイルが存在します`
        }

        let newFile = new FileNode(name);
        newFile.setParent(this.currentDirectory);
        this.currentDirectory.singlyLinkedList.add(newFile);

        return `ファイル名 ${name} の作成に成功しました`;

    }
    mkdir(dirName){
        let searchNode = this.currentDirectory.singlyLinkedList.search(dirName);
        if(searchNode !== undefined) return `カレントディレクト内にファイル名 ${searchNode.name} と同一のディレクトリまたはファイルが存在します`;

        //directory作成
        let newDirectory = new DirectoryNode(dirName);
        newDirectory.setParent(this.currentDirectory);

        this.currentDirectory.singlyLinkedList.add(newDirectory);

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
        }else{
            //current directory内でnameと一致するnodeを検索
            let searchNode = this.currentDirectory.singlyLinkedList.search(dirName);

            //nameが見つからない場合
            if(searchNode === undefined) return console.log("対象のフォルダが存在しません");

            this.currentDirectory = searchNode;
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
        let searchFile = this.currentDirectory.singlyLinkedList.search(fileName);

        //nameが見つからない場合
        if(searchFile === undefined) return "対象のファイルが存在しません";
        searchFile.setContent(content);
        return `${fileName}の情報を変更しました。 content: ${content}`;
    }
    rm(name){
        let searchFile = this.currentDirectory.singlyLinkedList.search(name);

        //nameが見つからない場合
        if(searchFile === undefined) return "対象のファイルが存在しません";

        //指定したnameをcurrent directoryから削除
        this.currentDirectory.singlyLinkedList.remove(name)
        return `${name} をカレントディレクトリから削除しました`;
    }
    help(){
        return this.commandList.reduce((helpMsg, command) => helpMsg + " " + command);
    }


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

    //     return universalValidatorResponse;
    // }

    // static commandArgumentsValidator(commandArgsArray){
    //     let commandValidatorResponse = {'isValid': true, 'message': ''};

    //     return commandValidatorResponse;
    // }

}



const history = new CommandHistory();
//File directory systemのインスタンスを作成
const FDSystem = new FileDirectorySystem();
Controller.initialize();



/// TEST /////////////////////////////////////////////////
