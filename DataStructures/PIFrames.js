
(function($) {


$(document).ready(function() {


//testing to see if listener sees the forward button
if ( $(".jsavforward").length ) {
    console.log("FOUND the jsavforward")
}

//testing to see if listener is working
$(".jsavforward").click(function() {
    console.log("jsav forward clicked")
});


//expose PIFrames interpreter globally
//when something is passed to the interpreter, it shows question and disables the forward button
//when submit question is hit, it checks answer and enables the forward button if appropriate

});
var PIFrames = {

    Injector(data, av_name) {
        var obj = {
            myData: data,

            //if there are multiple frames on one page, we need a reference to the correct one
            av_name: av_name,

            //the injection point on canvas
            class: "PIFRAMES",

            //may use this format if we decide to create a custom version of av.umsg()
            revealQuestionButton: $('<button />', {"class": 'RevealButton',
                                                   "text": 'Show Question'
                                                  }),

            disableForwardButton: function() {
            var forwardButton = $(`#${this.av_name}`).find("span.jsavforward");
            $(forwardButton).unbind("click");

            },

            alertMessage: function() {
                var button = `<button type="button" onclick="PIFRAMES.disableForwardButton()" class="RevealButton">Show Question</button>`;
                var message = '<p>You must answer the question to proceed forward. Click Show Question</p>';
                this.disableForwardButton();
                return (message+button)
            },

            getQuestion: function(id) {
                var key = this.myData.translations.en;
                var question = key[id];
                return question;
            },

            injectQuestion: function(id) {

                var question = this.getQuestion(id);
                var theHtml = this.buildElement(question);

                if($(`.${this.class}`).children().length > 0) {
                    $(`.${this.class}`).empty();
                    $(`.${this.class}`).append(theHtml);
                } else {
                    $(`.${this.class}`).append(theHtml);
                }


                return theHtml;
            },

            buildElement: function(question) {
                var type = question.type;

                switch(type) {

                    case "multiple":
                       return this.buildMultipleChoice(question);
                    case "true/false":
                    case "select":
                    case "drawing":

                }


            },
            buildMultipleChoice: function(question) {
                var choices = question.choices;
                var html = [];
                var header = `<p>${question.question}</p></br>`
                html.push(header);
                for (var i=0; i<choices.length; i++) {
                    var radio = `<input type="radio" value=${choices[i]}>${choices[i]}</></br>`
                    html.push(radio);
                   }
                return html.join('');
            }
        }
       return obj;

    },

    getQuestions(av_name) {
        var json_url = $('script[src*="/' + av_name + '.js"]')[0].src + 'on';
        var json_data;
        $.ajax({
            url: json_url,
            dataType: 'json',
            async: false,
            success: function(data) {
                json_data = data;
            }

        });

        return this.Injector(json_data, av_name);
    },

    //add div to the av_name's jsavcanvas, so that dynamic questions have a hooking point
    init(av_name) {
        var canvas = $(`#${av_name}`).children("div.jsavcanvas");
        var svg = $(canvas).children().first();
        var div = $('<div />', {"class": 'PIFRAMES'});
        $(div).css({"position": "absolute", "height": "100%", "display": "none"});
        $(canvas).append(div)
        return this.getQuestions(av_name);
    },

    //not sure exactly where this belongs, so keeping two version for now
    disableForwardButton: function() {
            console.log("clicked!!!")
            var forwardButton = $("#NFAtoDFACON").find(".jsavforward");
            console.log($(forwardButton).get(0).tagName)
            $(forwardButton).unbind("click")

            },

}

window.PIFRAMES = PIFrames;
})(jQuery);
