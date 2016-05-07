/**
 * Created by haoruitao on 16-5-4.
 */
window.onload = function(){
    var number = document.getElementById("number");
    var content = document.getElementById("content");
    var hide = document.getElementById("hide");
    var dialog = document.getElementById("dialog");

    createDialog();

    var cursorAt;
    var cursorNow;

    var status = false;
    var hasDialog = false;

    content.addEventListener("input",function(event){
        var str = content.value;

        number.innerHTML = getLength(str) + "";
        if(getLength(str) > 0) {

            var target = event.target;
            cursorNow = target.selectionStart;

            if (!hasDialog) {
                hide.innerHTML = str;

                if (target.value.charAt(cursorNow - 1) == '@' && !status) {
                    cursorAt = cursorNow - 1;

                    dialog.style.visibility = "visible";

                    hide.innerHTML = str.substr(0, cursorAt) + "<span>@</span>" + str.substr(cursorAt + 1);

                    var position = hide.getElementsByTagName("span")[0];

                    dialog.style.top = position.offsetTop + 27 + "px";
                    dialog.style.left = position.offsetLeft + 5 + "px";

                    status = true;

                    hasDialog = true;
                }
            } else {
                var find = str.substr(cursorAt + 1, cursorNow - cursorAt - 1);

                createDialog(find);
            }
        }else{
            content.value = str.substr(0,str.length - 1);
            hide.innerHTML = content.value;
        }
    });

    content.addEventListener("keydown",function(event){
        switch (event.keyCode) {
            case 38: //上
                var previous = getPreviousSelected();
                var current = getCurrentSelected();

                removeClass(current,"selected");
                addClass(previous,"selected");

                return false;
                break;
            case 40: //下
                var current = getCurrentSelected();
                var next = getNextSelected();

                removeClass(current,"selected");
                addClass(next,"selected");

                return false;
                break;
            case 13: //回车
                var current = getCurrentSelected();

                var str = content.value;

                content.value = str.substr(0,cursorAt + 1) + current.innerHTML + " " + str.substr(cursorNow);
                hide.innerHTML = content.value;

                dialog.style.visibility = "hidden";

                status = false;
                hasDialog = false;

                createDialog();

                return false;
                break;
            case 32: //空格
                dialog.style.visibility = "hidden";

                status = false;
                hasDialog = false;
                break;
            case 8: //回退
                if(content.value.charAt(cursorNow - 1) == "@"){
                    dialog.style.visibility = "hidden";

                    status = false;
                    hasDialog = false;
                }
                createDialog();
                break;
        }
    });
};

function getCurrentSelected(){
    var usernames = document.getElementsByClassName("username");

    for(var i = 0;i < usernames.length;i++){
        if(hasClass(usernames[i],"selected")){
            return usernames[i];
        }
    }
}

function getPreviousSelected(){
    var usernames = document.getElementsByClassName("username");

    for(var i = 0;i < usernames.length;i++){
        if(hasClass(usernames[i],"selected")){
            if(i == 0){
                return usernames[usernames.length - 1];
            }else{
                return usernames[i - 1];
            }
        }
    }
}

function getNextSelected(){
    var usernames = document.getElementsByClassName("username");

    for(var i = 0;i < usernames.length;i++){
        if(hasClass(usernames[i],"selected")){
            if(i == usernames.length - 1){
                return usernames[0];
            }else {
                return usernames[i + 1];
            }
        }
    }
}

function getLength(str){
    var length = 0;
    for(var i = 0;i < str.length;i++){
        if(str.charCodeAt(i) > 255){
        //    是汉字
            length++;
        }else{
            length += 0.5;
        }
    }

    return 140 - Math.ceil(length);
}

function createDialog(str) {
    var persons = ["jinm", "John", "xxxx", "agwgi", "jiml", "jigwgg"];

    var dialog = document.getElementById("dialog");
    var first = true;

    dialog.innerHTML = '<div class="tip">选择昵称或轻敲空格完成输入</div>';

    if(str != undefined && str != "") {
        var regexp = new RegExp('^' + str, 'i');
        for (var i = 0; i < persons.length; i++) {
            if (regexp.test(persons[i])) {
                if (first) {
                    dialog.innerHTML = dialog.innerHTML + ('<div class="username selected">' + persons[i] + '</div>');
                    first = false;
                } else {
                    dialog.innerHTML = dialog.innerHTML + ('<div class="username">' + persons[i] + '</div>');
                }
            }
        }
    }
}

function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}