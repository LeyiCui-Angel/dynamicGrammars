# Structured Editors for logic

Writing specifications in logic (especially temporal logic) is hard.
Needing to memorize the syntax of such logics does not help.
The goal of this repo is to explore how structured editors can be used as an alternative interface for writing temporal logic specifications.

The hypothesis is that structured editors are uniquely well suited for logics because of the relatively small grammar of a logic language.
Whereas structured editors tend to be too restrictive and cumbersome in general purpose programming languages, it should be a better fit for temporal logic.

## Try a live demo

<p><a href="frontEnd/tsl-api.html">Structured editor for TSL</a></p>

## install

No steps to install! Just open up the frontEnd folder

## extras

We use the `nearly` library for specifying the grammar.

If you

    npm install -g nearley

You can then use

    nearleyc grammarDef/tsl_grammar.ne -o grammarDef/tsl_grammar.js


to generate nicer representation of the grammar. We don't use this for now, but it might come in handy at some point.
