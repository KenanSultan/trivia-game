function startGame() {
    allAnswers = []
    randomNums = []
    correct = 0
    incorrect = 0
    unanswered = 0
    total = 0
}

startGame()

function gameResults() {
    $(".answers-div").empty()
    $(".gif-div").empty()
    $(".correct-div").removeClass("d-inline-block").addClass("d-none")
    $(".question-div").html("<h4> All done, heres how you did! </h4>")
    $(".again-btn").removeClass("d-none").addClass("d-inline-block")

    $("#corrects").text(correct)
    $("#incorrects").text(incorrect)
    $("#unanswereds").text(unanswered)
    $(".results-div").removeClass("d-none").addClass("d-inline-block")
}

function nextQuestion() {
    if (total < 8) {
        allAnswers = []
        randomNums = []
        $("#second").text("30")
        $(".correct-div").removeClass("d-inline-block").addClass("d-none")
        connectAjax()
        second = 30
        startTimer()
    } else {
        gameResults()
    }
}

function timeOut() {
    unanswered++
    clearInterval(timerVar)
    $(".answers-div").empty()
    $(".question-div").html("<h4> Out Of Time! </h4>")
    $(".correct-div").removeClass("d-none").addClass("d-inline-block")

    setTimeout(nextQuestion, 3000)
}

function startTimer() {
    second = 30
    timerVar = setInterval(showTime, 1000)

    function showTime() {
        second--
        $("#second").text(second)
        if (second === 0) timeOut()
    }
}

function connectAjax() {
    $.ajax({
        url: "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple"
    }).done(function (resp) {
        total++

        function winFunc() {
            correct++
            clearInterval(timerVar)
            $(".question-div").html("<h4> Correct! </h4>")
            $(".answers-div").empty()
            setTimeout(nextQuestion, 3000)
        }

        function loseFunc() {
            incorrect++
            clearInterval(timerVar)
            $(".question-div").html("<h4> Nope! </h4>")
            $(".answers-div").empty()
            $(".correct-div").removeClass("d-none").addClass("d-inline-block")
            setTimeout(nextQuestion, 3000)
        }

        console.log(resp)
        $(".question-div").html("<h4 class='info m-2'>" + resp.results[0].question + "</h4>")
        $("#correct").text(resp.results[0].correct_answer)

        allAnswers.push(resp.results[0].correct_answer)
        for (let j = 0; j < 3; j++) {
            allAnswers.push(resp.results[0].incorrect_answers[j])
        }

        while (randomNums.length < 4) {
            let random = Math.floor(Math.random() * 4)
            if (randomNums.indexOf(random) === -1) {
                randomNums.push(random)
            }
        }

        for (i in randomNums) {
            var buton = $("<button>").addClass("btn btn-warning m-2 choises").text(allAnswers[randomNums[i]])
            $(".answers-div").append(buton)
        }

        $(".choises").on("click", function () {
            if ($(this).text() == resp.results[0].correct_answer) {
                winFunc()
            } else {
                loseFunc()
            }
        })

    })
}

$(".start-btn").on("click", function () {
    $(this).addClass("d-none")
    $(".timer-div").removeClass("d-none").addClass("d-inline-block")
    startTimer()
    connectAjax()
})

$(".again-btn").on("click", function () {
    $(this).removeClass("d-inline-block").addClass("d-none")
    $("#second").text("30")
    $(".results-div").removeClass("d-inline-block").addClass("d-none")
    $(".question-div").html("")
    startGame()
    startTimer()
    connectAjax()
})