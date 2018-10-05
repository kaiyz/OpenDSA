
(function($) {


$(document).ready(function() {
  console.log("PIFRAMES HAS BEEN CALLED")

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
            binding: av_name,

            //the injection point on canvas
            class: 'p.jsavoutput jsavline',

            getQuestion: function(id) {
                var key = this.myData.translations.en;
                var question = key[id];
                return question;
            },
            injectQuestion: function(id) {
                var question = this.getQuestion(id);
                var theHtml = this.buildElement(question);
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
    }
}

window.PIFRAMES = PIFrames;
})(jQuery);