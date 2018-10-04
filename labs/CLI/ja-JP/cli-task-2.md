 # CLI Lab
## タスク 2
  **CLIのセットアップができたら、さっそく最初のプロジェクトに取り掛かりましょう**

1. ターミナルウィンドウ(もしくはコマンドプロンプト)を開いて、任意の作業ディレクトリに移動してください。

**ノート:** ターミナルウィンドウを開いたら、この Lab の間はウィンドウを閉じないでおきましょう。

2. 次のコマンドを入力してください 

  ```
ask new
  ```

3. スキル名を指定してください。

コマンドを実行すると "Please type in your new skill name:" と入力が促されますので、スキル名を入力してください。スキル名はなんでもかまいませんが、内容を連想させるようなものがおすすめです。ここでは `hello-world` としておきましょう。

**確認:** *"New Project for Alexa Skill Created"* というメッセージが出ているはずです

4. `/hello-world` ディレクトリに移動

CLI は "hello-world" という名のディレクトリを作成して、 その中に Alexa スキルプロジェクトに必要なファイルを生成します。

5. ターミナルウィンドウから次のコマンドを入力してください:

  ```
ask deploy
  ```

このコマンドは、あなたの Alexa スキルの lambda 関数と対話モデルをクラウドにデプロイします。

6. [AWS コンソール](https://aws.amazon.com/lambda/) にログインして、lambda 関数がデプロイされているか確認してください。

7. 同様に [alexa developer console](https://developer.amazon.com/alexa/console/ask) にログインして、対話モデルがデプロイされているか確認してください。

8. アカウントに紐づいた Echo デバイスでデプロイしたスキルをテストします。"Alexa, start greeter" と話しかけてみてください。 もしデバイスをお持ちでなければ、[alexa developer console](https://developer.amazon.com/alexa/console/ask) の「テスト」ページ、もしくは [echosim.io](https://www.echosim.io) でテストすることもできます。

**早く終わった方は** ぜひ周りの方を助けてあげてください。
