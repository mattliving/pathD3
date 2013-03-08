require.config({
    paths: {
        jquery: '../components/jquery/jquery.min',
        d3: '../components/d3/d3.min',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        d3: {
            exports: 'd3'
        }
    }
});

require(['jquery', 'd3', 'network'], function ($, d3, Network) {
    'use strict';
    var network = Network();

    d3.json('/scripts/data1.json', function(error, json) {
        network('#svg', json);
    });
});