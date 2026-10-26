'use strict';



// ==============================
//  ハンバーガーメニュー
// ==============================
const hamburgerClickEvent = () => {
    const hamburger = document.querySelector('.hamburger');
    const hamburgerLine = document.querySelectorAll('.hamburger__line');
    const nav = document.querySelector('.nav');
    const navItem = document.querySelectorAll('.nav__item');
    const body = document.querySelector('body');
    // ハンバーガーボタンを押したときの処理
    hamburger.addEventListener('click',()=>{
        hamburger.classList.toggle('open');
        hamburgerLine.forEach((element)=>{
            element.classList.toggle('open');
        });
        nav.classList.toggle('open');
        body.classList.toggle('open');
    });
    // nav__itemを押したときの処理
    navItem.forEach((item)=>{
        item.addEventListener('click',()=>{
            hamburger.classList.remove('open');
            hamburgerLine.forEach((element)=>{
                element.classList.remove('open');
            });
            nav.classList.remove('open');
            body.classList.remove('open');
        });
    });
};


// ==============================
//  フェードインアニメーション
// ==============================
const fadeInAnimation = () =>{
    const fadeItem = document.querySelectorAll('.fadeIn');

    const observer = new IntersectionObserver((entries) => {
        // 配列形式の要素にforEachで処理を行う
        entries.forEach((entry) => {
            // 要素が画面内に入ったら
            if(entry.isIntersecting) {
                // showクラスを付与
                entry.target.classList.add('show');

                // 処理は一度だけ実行
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2,
    });

    // 監視開始
    fadeItem.forEach((item) => {
        observer.observe(item);
    });
};



// ==============================
// お問い合わせフォーム
// ==============================

/*===== 要素を取得 ====== */
const form = document.querySelector('.form');
const formBtn = document.querySelector('.form__btn');
const inputs = document.querySelectorAll('.input');


/*===== エラーメッセージを表示 ====== */
const showError = (input,message) => {
    const error = input.parentElement.querySelector('.error__message');
    error.textContent = message;
};
/*===== エラーメッセージを削除 ====== */
const clearError = (input)=>{
    showError(input,"");
};

/*===== バリデーションの判定 ====== */
const isValid = (input) => {
    // inputの値を取得（余分なスペースを削除）
    const value = input.value.trim();

    // 空欄の場合に返すオブジェクト
    if(value === ""){
        return {
            valid: false,
            message: "必須項目です"
        }
    }

    // ひらがな欄で正規表現に一致しない場合に返すオブジェクト
    if(input.classList.contains("input__hiragana")){
        const regex = /^[ぁ-ん]+([ 　][ぁ-ん]+)*$/;

        // 正規表現と一致いしなければ、エラーメッセージを表示
        if(!regex.test(value)){
            return {
                valid: false,
                message: "ひらがなで入力してください"
            }
        }
    }

    // メールアドレス欄で正規表現に一致しない場合に返すオブジェクト
    if(input.classList.contains("input__email")){
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // 正規表現と一致いしなければ、エラーメッセージを表示
        if(!regex.test(value)){
            return {
                valid: false,
                message: "メールアドレスの形式で入力してください"
            }
        }
    }

    // 入力内容が正しい場合に返すオブジェクト
    return {
        valid: true,
        message: ""
    }
};

/*===== バリデーションの判定をもとにエラーの表示を制御 ====== */
const validate = (input) => {

    // バリデーションの判定を代入
    const result = isValid(input);
    // validキーの値がfalseならエラーメッセージを表示する
    if(result.valid === false) {
        showError(input, result.message);
        return false;
    }

    // trueならエラーメッセージを表示しない
    clearError(input);
    return true;
}

/*===== ボタンの・活性非活性（スタイルの制御） ====== */
const updateFormBtn = () => {

    // 全てのinput配列をスプレッド演算子で複製してバリデーションの判定結果（trueまたはfalse）を返す
    const allInputs = [...inputs].every(input => {
        return isValid(input).valid;
    });

    // 判定結果(trueまたはfalse)に対応してdisabled属性も連動
    formBtn.disabled = !allInputs;

    // 判定結果に応じてクラスをつけ外す
    formBtn.classList.toggle("inactive", allInputs);
}

/*===== 入力欄からカーソルが外れるたびに入力内容を判定 ====== */
const blurEvent = () => {

    inputs.forEach(input =>{

        input.addEventListener('blur', () => {
            input.dataset.touched = 'true';
            validate(input);
            // ボタンの活性・非活性を判定
            updateFormBtn();
        });
    });
}

/*===== 入力内容が変わるたびに入力内容を判定 ====== */
const inputEvent = () => {
    inputs.forEach(input => {
        input.addEventListener('input', () => {

            // 一度でも入力欄を触ってから判定する（初期状態でエラーを表示しないため）
            if(input.dataset.touched) {
                validate(input);
            }
            // ボタンの活性・非活性を判定
            updateFormBtn();
        });
    });
};

/*===== 送信ボタン押したときの処理 ====== */
const submitEvent = () => {
    form.addEventListener('submit',(event) => {

        let isFormValid = true;

        inputs.forEach(input => {

            input.dataset.touched = 'true';

            if(!validate(input)){
                isFormValid = false;
            };
        });

        if (isFormValid === false) {
            event.preventDefault();
        }
    });
};

/*===== HTML読み込み完了後、処理を実行する ====== */
document.addEventListener("DOMContentLoaded", () => {
    hamburgerClickEvent();
    fadeInAnimation();
    blurEvent();
    inputEvent();
    submitEvent();
    updateFormBtn();
});