/*

This task sets up the grunt.data properties needed to correctly generate a
round. You should run it using the `open` meta-task:

```
grunt open --round=round_id
```

By using the CLI options, instead of a target (as we do with `publish`), we
can make this the default task, and it'll be preserved across `watch` runs.

*/

module.exports = function(grunt) {

  var getSheet = function(id) { return grunt.data.json[id] };



  grunt.registerTask("matchups", function() {



    //load up candidate metadata
    var candidates = getSheet("candidates");
    var bracketClosed = grunt.option("closed");

    var processRound = function(sheet, { past, active }) {
      var round = { matchups: [], past, active };
      //future rounds
      if (!sheet) return round;

      for (var i = 0; i < sheet.length; i += 2) {

        var a = sheet[i];
        var b = sheet[i + 1];
        a.votes *= 1;
        b.votes *= 1;
        console.log(a.votes);
        var matchup = {
          options: [a, b],
          total: a.votes + b.votes || 0,
          winner: a.winner ? a.name : b.winner ? b.name : null,
          index: i / 2
        };
        matchup.options.forEach(function(option) {
          option.details = candidates[option.id];
        });
        if (past || bracketClosed) {
          matchup.winner = a.votes > b.votes ? a.name : b.name
        }
        round.matchups.push(matchup);
      }
      return round;
    };

    var orderSheet = getSheet("rounds");

    if (!orderSheet) {
      grunt.fail.fatal("Unable to load the config sheet with order data -- have you run `grunt sheets`?");
    }

    var roundID = grunt.option("round");

    if (!roundID) {
      grunt.log.errorlns("You didn't specify a round, defaulting to the first in config sheet (\"" + orderSheet[0].sheet + "\"). Use --round=round_id to avoid this error.");
      roundID = orderSheet[0].sheet;
    }

    if (!getSheet(roundID)) {
      grunt.fail.fatal("Sheet for the specified round doesn't exist -- do you need to re-run `grunt sheets`?");
    }

    //technically, we don't need order, but I dislike assuming object key order is reliable
    var bracket = {
      rounds: [],
      current: roundID
    };

    orderSheet.sort(function(a, b) {
      return a.order - b.order;
    });

    // process rounds
    var future = true;
    for (var i = 0; i < orderSheet.length; i++) {
      var order = orderSheet[i];
      var sheet = getSheet(order.sheet);
      var active = order.sheet == roundID;
      var past = !active; // Lauren changed this line from Seattle Jersey Bracket
      if (active) {
        future = true;
      }
      var data = processRound(sheet, { active, past });
      for (var k in order) {
        data[k] = order[k];
      }
      data.id = order.sheet;
      bracket.rounds.push(data);
      // if (data.current) break;
    }

    bracket.closed = bracketClosed;
    grunt.data.bracket = bracket;

  });

};
