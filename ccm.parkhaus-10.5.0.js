/**
 * @overview ccm component for parkhaus
 * @author Manfred Kaul <manfred.kaul@h-brs.de> 2017, 2018, 2019, 2020, 2021
 * @license The MIT License (MIT)
 *
 */

( function () {

    var component  = {

        name: 'parkhaus',
        version: [10,5,0],

        ccm: 'https://kaul.inf.h-brs.de/ccmjs/ccm/versions/ccm-26.3.1.min.js',

        helper: [ "ccm.load", "https://kaul.inf.h-brs.de/ccmjs/akless-components/modules/versions/helper-7.2.0.min.mjs" ],

        config: {
            name: "CarHome",
            // server_url: "http://localhost:8080/DemoServlet7",
            max: 10, // maximum number of parking slots
            // license_max: 100,  // maximum number of license numbers
            // license_min: 90,  // define range of numbers for license plates of cars
            open_from: 6,
            open_to: 24,
            delay: 100,
            simulation_speed: 10,
            simulation: {
                max: 3,    // range of random choices is 0 ... max-1
                enter: 2,  // enter car into garage for all random choices below this enter value
                delay: 2   // wait for simulation delay factor * self.delay
            },
            // price_factor: 1, // number or object for different price factors per user category or vehicle type
            price_factor: {"SUV":2,"Family":0.5,"Woman.SUV":1.2},
            client_categories: ["Family","Woman","any"],
            vehicle_types: ["PKW","SUV","Scooter"],
            // hide_table: true,
            // debug: true,
            space_color: {  // ToDo mapping category => color
                "1": "pink",  // female
                "3": "yellow",  // family
                "6": "black"
            },
            html: {
                main: {
                    inner: [
                        { "tag": "p", "class": "alert", "inner": "" },  // html.main.inner.0.inner
                        { tag: 'h3', inner: [
                                'Autos im Parkhaus: &nbsp; ',
                                { tag: 'span', class: 'counter', inner: '0' },
                                ', &nbsp; Max: &nbsp; ',
                                { tag: 'input', class: 'max', type: 'number', min: 0, value: "%max%", oninput: '%oninput%' },
                                ' &nbsp; Frei: &nbsp; ',
                                { tag: 'span', class: 'free', inner: ' &nbsp; &nbsp; ' }
                            ] }, { tag: 'h3', inner: [ 'Öffnungszeiten von: &nbsp; &nbsp; ',
                                { tag: 'input', class: 'open_from', type: 'number', min: 0, max: 24, value: "%open_from%", oninput: '%oninput%' },
                                ' &nbsp; bis: &nbsp; ',
                                { tag: 'input', class: 'open_to', type: 'number', min: 0, max: 24, value: "%open_to%", oninput: '%oninput%' },
                            ] }, { tag: 'h4', inner: [ 'Simulation: &nbsp; ',
                                { tag: 'button', class: 'start', onclick: '%start_simulation%', inner: 'Start', title: 'Start simulation!' },
                                { tag: 'button', class: 'stop', onclick: '%stop%', inner: 'Stop', title: 'Stop simulation!' }
                            ] },
                        { class: 'button_container', inner: [
                                { tag: 'button', class: 'enter', onclick: '%enter%', inner: 'Enter', title: 'Drive your car into the garage!' },
                                ' &nbsp; Ticket: ',
                                { tag: 'span', class: 'ticket_hash' }
                            ] },
                        { class: 'button_container', inner: [ { tag: 'span', class: 'extra_buttons' } ] },
                        { class: 'button_container', inner: [ { tag: 'span', class: 'extra_charts' } ] },
                        { tag: 'img', class: 'entry', src: '%car%', "width":"80", "height":"30" },
                        { tag: 'span', class: 'traffic_light' },
                        { tag: 'img', src: '%parking_garage%', "width":"125", "height":"117" },
                        { class: 'exit_car_container', inner: { tag: 'img', class: 'exit', src: '%empty%', "width":"80", "height":"30" } },
                        { class: 'garage' },
                        { tag: 'hr' },
                        { tag: 'table', inner: [
                                { tag: 'tr', inner: [ { tag: 'th', inner: 'Nr', title: 'Nr des Autos' }, { tag: 'th', inner: 'Von', title: 'Startzeit des Parkens' }, { tag: 'th', inner: 'Bis', title: 'Endzeit des Parkens' }, { tag: 'th', inner: 'Dauer', title: 'Wie lange war das Auto im Parkhaus?' }, { tag: 'th', inner: 'Kunden Typ', title: 'Client Category' }, { tag: 'th', inner: 'Vehicle Typ', title: 'Fahrzeug-Typ' }, { tag: 'th', inner: 'Kennzeichen', title: 'License' }, { tag: 'th', inner: 'Preis', title: 'Parkgebühren' } ] }
                            ] },
                        { tag: 'div', class: 'errors', style: 'display: none;' }
                    ]
                },
                row: { tag: 'tr', inner: [ { tag: 'td', inner: '%nr%' }, { tag: 'td', inner: '%von%' }, { tag: 'td', inner: '%bis%' }, { tag: 'td', inner: '%dauer%' }, { tag: 'td', inner: '%ctyp%' }, { tag: 'td', inner: '%vtyp%' }, { tag: 'td', inner: '%license%' }, { tag: 'td', class: 'price', inner: '%preis%' } ] },
                extra_button_div: { inner: [
                        { tag: 'button', class: '%extra_class%', inner: '%extra_inner%', title: '%extra_popup_title%' },
                        { tag: 'span', class: '%extra_class%' }
                    ] },
                extra_chart_div: { inner: [
                        { tag: 'button', class: '%extra_class%', inner: '%extra_inner%', title: '%extra_popup_title%' },
                        { tag: 'input', class: '%extra_class%', type: 'checkbox' },
                        { tag: 'div', class: '%extra_class%' }
                    ] }
            },

            // no_keyboard: true,

            images: {
                car: 'https://kaul.inf.h-brs.de/ccmjs/mkaul-components/parkhaus/resources/car.png',
                parking_garage: 'https://kaul.inf.h-brs.de/ccmjs/mkaul-components/parkhaus/resources/parking_garage.png',
                empty: 'https://kaul.inf.h-brs.de/ccmjs/mkaul-components/parkhaus/resources/empty.png'
            },

            messages: {
                parkhaus_full: 'Sorry, Parkhaus is full.',
                parkhaus_closed: 'Sorry, Parkhaus is closed.',
                occupied_slot: { tag: 'li', inner: '%id% schon belegt.' },
                invalid_slot: { tag: 'li', inner: '%id% ungültig.' },
            },

            // "extra_buttons": [
            //   {
            //     "extra_class": "sum",
            //     "extra_inner": "SUM",
            //     "extra_popup_title": "Sum of all parking fees"
            //   },
            //   {
            //     "extra_class": "avg",
            //     "extra_inner": "AVG",
            //     "extra_popup_title": "Average of all parking fees"
            //   }
            // ],

            // "extra_buttons": '["sum","avg","max"]'  // short form

            // "extra_buttons": [{
            //    "extra_class": "sum start",
            //    "extra_inner": "SUM and Restart",
            //    "extra_popup_title": "Sum of all parking fees"
            //  }],

            // "extra_buttons": [{"extra_class":"sum start","extra_inner":"SUM and Restart","extra_popup_title":"Sum of all parking fees"}],

            //
            // "extra_charts": [
            //   {
            //     "extra_class": "chart",
            //     "extra_inner": "Chart",
            //     "extra_popup_title": "Chart of all parking fees"
            //   }
            // ],

            traffic_light: {
                tag: 'svg', viewBox: '0 0 200 500', xmlns: 'http://www.w3.org/2000/svg', width: '40', height: '100', inner: [
                    {
                        "tag": "rect",
                        "style": "fill: rgb(100, 86, 86);",
                        "width": "200",
                        "height": "500",
                        "rx": "30",
                        "ry": "30"
                    },
                    {
                        "tag": "circle",
                        "id": "green",
                        "style": "fill: rgb(77, 251, 3);",
                        "cx": "98.65",
                        "cy": "407.68",
                        "r": "70.2"
                    },
                    {
                        "tag": "circle",
                        "id": "yellow",
                        "style": "fill: rgb(239, 251, 3);",
                        "cx": "98.78",
                        "cy": "247.42",
                        "r": "70.2"
                    },
                    {
                        "tag": "circle",
                        "id": "red",
                        "style": "fill: rgb(251, 3, 3);",
                        "cx": "99.55",
                        "cy": "81.53",
                        "r": "70.2"
                    }
                ]
            },
            parking_space: {
                tag: 'svg', id: '%id%', class: 'space', viewBox: '0 0 500 500', xmlns: 'http://www.w3.org/2000/svg', inner: [
                    {
                        "tag": "polygon",
                        "style": "fill: rgb(245, 245, 245); stroke-width: 10px;stroke: %color%;",
                        "points": "0 300 0 500 500 500 500 300 450 300 450 460 45 460 45 300 0 300"
                    },
                    // {
                    //   "tag": "rect",
                    //   "x": "90.33",
                    //   "y": "253.62",
                    //   "width": "300",
                    //   "height": "38.11",
                    //   "style": "fill: rgb(245, 245, 245); stroke-width: 10px; stroke: rgb(0, 0, 0);",
                    //   "transform": "matrix(0.70711, 0.70711, -0.70711, 0.70711, 274.20139, -90.07433)"
                    // },
                    // {
                    //   "tag": "rect",
                    //   "x": "100",
                    //   "y": "161.89",
                    //   "width": "300",
                    //   "height": "38.11",
                    //   "style": "fill: rgb(245, 245, 245); stroke-width: 10px; stroke: rgb(0, 0, 0);",
                    //   "transform": "matrix(0.70711, -0.70711, 0.70711, 0.70711, -57.54487, 317.01862)"
                    // },
                    {
                        "tag": "text",
                        "text-anchor": "middle",
                        "x": "250",
                        "y": "350",
                        "style": "white-space: pre; fill: rgb(51, 51, 51); font-size: 200px; text-align: center;",
                        "inner": "%nr%"
                    }
                ]
            },
            car: {
                tag: 'svg', id: '%id%', class: 'car', viewBox: '0 0 310 255', xmlns: 'http://www.w3.org/2000/svg', inner: [
                    {
                        "tag": "g",
                        "transform": "translate(2.441785,-204.56609)",
                        "style": "fill:#000000;fill-opacity:1;stroke:none",
                        "inner": [
                            {
                                "tag": "path",
                                "style": "fill-opacity: 0.85; fill-rule: evenodd; paint-order: stroke; stroke: rgb(0, 0, 0); stroke-width: 8px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: %color%;",
                                "d": "m -53.582954,-415.35856 c -13.726061,-0.48561 -25.554278,3.95581 -32.848561,19.90697 l -26.336555,65.94442 c -19.18907,5.29042 -27.54259,19.22853 -27.98516,30.66415 l 0,86.34597 25.30617,0 0,29.05676 c -1.22633,27.69243 44.157018,28.76272 45.171926,-0.28851 l 0.535799,-28.52096 164.160378,0 0.535798,28.52096 c 1.014898,29.05121 46.439469,27.98094 45.213139,0.28851 l 0,-29.05676 25.26495,0 0,-86.34597 c -0.44257,-11.43562 -8.79607,-25.37375 -27.98516,-30.66415 l -26.33655,-65.94442 c -7.29428,-15.95113 -19.122506,-20.39255 -32.848559,-19.90697 l -131.847615,0 z m 3.008714,22.87447 c 1.148077,-0.006 2.358386,0.0326 3.585728,0.0824 l 119.070884,0.37094 c 10.897921,-0.25425 15.519886,3.3e-4 20.154262,10.30382 l 18.959016,51.10692 -197.50352,-0.24729 18.752943,-49.74682 c 2.924271,-9.95822 8.944151,-11.82604 16.980687,-11.87 l 0,3e-5 z m -41.462551,87.45878 c 11.803644,2e-5 21.39072,9.54587 21.39072,21.34951 0,11.80363 -9.587076,21.39072 -21.39072,21.39072 -11.803639,0 -21.390719,-9.58708 -21.390719,-21.39072 0,-11.80366 9.58708,-21.34951 21.390719,-21.34951 z m 209.950531,0 c 11.80364,-2e-5 21.3495,9.54587 21.3495,21.34951 0,11.80364 -9.54586,21.39072 -21.3495,21.39072 -11.80364,10e-6 -21.390719,-9.58708 -21.390719,-21.39072 0,-11.80364 9.587079,-21.34951 21.390719,-21.34951 z m -14.69214,-28.11863 0,0 z",
                                "transform": "matrix(0.9797897,0,0,0.9877946,140.46678,619.88975)",
                                "inner": {
                                    "tag": 'title',
                                    "inner": "%tooltip%",
                                }
                            }
                        ]
                    },
                    {
                        "tag": "rect",
                        "style": "fill: rgb(216, 216, 216); paint-order: stroke; stroke: rgb(0, 0, 0); stroke-width: 8px;",
                        "x": "100",
                        "y": "134.69",
                        "width": "111.26",
                        "height": "44.79",
                        "rx": "15",
                        "ry": "15"
                    },
                    {
                        "tag": "text",
                        "text-anchor": "middle",
                        "x": "150",
                        "y": "170",
                        "style": "white-space: pre; fill: rgb(51, 51, 51); font-size: 38px; text-align: center;",
                        "inner": "%nr%"
                    },
                    // {
                    //   "tag": "rect",
                    //   "class": "leave_button",
                    //   "onclick": "%leave%",  // does not work because of SVG Hack innerHTML += '' and re-rendering
                    //   "style": "stroke:#fff;fill:#fff;fill-opacity:0;stroke-opacity:0;cursor:pointer;",
                    //   "x": "90",
                    //   "y": "120",
                    //   "width": "140",
                    //   "height": "70"
                    // },
                ]
            },

            hash: [ "ccm.load", { "url": "https://kaul.inf.h-brs.de/ccmjs/akless-components/modules/md5.mjs", "type": "module" } ],
            SALT: "123",

            format: "json",

            chart: [ "ccm.component", "https://kaul.inf.h-brs.de/ccmjs/mkaul-components/plotly/versions/ccm.plotly-1.1.2.js" ],

            // background_color: 'yellow',

            css: [ 'ccm.load',  'https://kaul.inf.h-brs.de/ccmjs/mkaul-components/parkhaus/resources/default.css' ]
            // css: [ 'ccm.load',  'https://kaul.inf.h-brs.de/ccmjs/mkaul-components/parkhaus/resources/default.css' ]
        },

        /**
         * for creating instances of this component
         * @constructor
         */
        Instance: function () {

            "use strict";

            /**
             * own reference for inner functions
             * @type {Instance}
             */
            const self = this;

            /**
             * shortcut to help functions
             * @type {Object.<string,function>}
             */
            let $;

            /**
             * is the simulation running?
             * @type {Boolean}
             */
            let simulationIsRunning = false;

            /**
             * is called once after the initialization and is then deleted
             */
            this.ready = async () => {

                // set shortcut to helper functions
                $ = Object.assign( {}, this.ccm.helper || ccm.helper, this.helper );

                // if ( ! this.ccm.allHashes ) this.ccm.allHashes = {};

            };

            /**
             * starts the instance
             */
            this.start = async () => {

                const main_elem = $.html( self.html.main, Object.assign({
                    start_simulation,
                    stop,
                    enter,
                    oninput,
                    date: new Date().toLocaleString()
                }, self.images, (({ name, max, open_from, open_to, delay, simulation_speed }) => ({ name, max, open_from, open_to, delay, simulation_speed }))(self) ) );

                const ticket_hash = main_elem.querySelector('.ticket_hash');
                const table = main_elem.querySelector( 'table' );
                if ( self.hide_table && self.hide_table !== "false" ) table.style.display = 'none';
                const error_div = main_elem.querySelector('.errors');
                const header = {};
                ['counter','max','free','open_from','open_to' ].forEach( className => {
                    header[ className ] = main_elem.querySelector('.'+className);
                });
                const exit_car_container = main_elem.querySelector('.exit_car_container');
                const exit_img = main_elem.querySelector("img.exit");

                const date_div = main_elem.querySelector('.date');
                if ( date_div ) setInterval(()=>{
                    date_div.innerText = new Date().toLocaleString();
                },1000);

                const garage_div = main_elem.querySelector('div.garage');

                class Garage {  // single source of truth for max and all counters
                    constructor( max ){
                        this._max = max;
                        this._total = 0; // total number of cars ever entered
                        this._space_index = {};
                        this._car_index = {};
                        this.image();
                    }
                    get max(){
                        return this._max;
                    }
                    set max( max ){
                        this._max = parseInt( max ) || 0;
                    }
                    get total(){
                        this._total = Math.max( this._total, this.countCars() );
                        return this._total;
                    }
                    set total( next ){
                        this._total = parseInt( next ) || 0;
                    }
                    nextTotal(){
                        this._total += 1;
                        return this.total;  // TODO
                    }
                    countCars(){
                        return Object.keys( this._space_index ).length;
                    }
                    freeSpace(){
                        return ( this.max || 0 ) - ( this.countCars() || 0 );
                    }
                    getCarById( id ){
                        return this._car_index[ id ];
                    }
                    getAllCarLicenses(){
                        return Object.values( this._car_index ).map( car => car.license );
                    }
                    getCarBySpace( nr ){
                        return this._space_index[ nr ];
                    }
                    async addCar( car ){
                        if ( garage.countCars() >= garage.max ){
                            csv_post_event( 'full', (new Date()).getTime() );
                        } else if ( self.open_from && parseInt( self.open_from ) > (new Date( simulationNow() )).getHours() ||
                            self.open_to && (new Date( simulationNow() )).getHours() > parseInt( self.open_to ) - 1 ) {
                            csv_post_event( 'closed', new Date( simulationNow() ).toLocaleString() );
                            show_error( $.html( { tag: 'li', inner: self.messages.parkhaus_closed }) );
                            console.log( 'closed', new Date( simulationNow() ).toLocaleString() );
                        } else {
                            car.enter();
                            let reply;
                            if ( ! self.json_format || self.json_format === "false" ){
                                reply = await csv_post_event( 'enter', ...car.toArray() );
                                if ( reply ){
                                    if ( reply.includes(',') ){
                                        const [ space, color ] = reply.split(',');
                                        car._space = parseInt( space.trim() );
                                        car._color = color;
                                    } else {
                                        car._space = parseInt( reply.trim() );
                                    }
                                }
                            } else {
                                reply = await csv_post_event( 'enter', car.toJSON() );
                                if ( reply ){
                                    if ( typeof reply === 'string' ){
                                        if ( reply.trim().startsWith('{') ){
                                            reply = JSON.parse( reply );
                                            if ( reply.space ) car._space = parseInt( reply.space );
                                            if ( reply.color ) car._color = reply.color;
                                        } else {
                                            car._space = parseInt( reply );
                                        }
                                    } else {
                                        if ( typeof reply === 'object' ){
                                            if ( reply.space ) car._space = parseInt( reply.space );
                                            if ( reply.color ) car._color = reply.color;
                                        } else {
                                            car._space = parseInt( reply );
                                        }
                                    }
                                }
                            }
                            this.driveCarIntoSpace( car );
                        }
                    }
                    driveCarIntoSpace( car ){  // synchronous car moving
                        if ( car ) this._car_index[ car.id() ] = car;
                        if ( car && car.space > 0 && car.space <= this.max ){
                            const oldChild = garage_div.querySelector('#' + car.space_id() );
                            if ( oldChild && oldChild.classList.toString().trim() === 'space' ){  // space is free
                                (async ()=>{  // only traffic lights are concurrent
                                    await sleep( parseInt( self.delay ) );
                                    switch_traffic_light( "yellow" );
                                    await sleep( parseInt( self.delay ) );
                                    switch_traffic_light( "green" );
                                    main_elem.querySelector("img.entry").src = self.images.empty;
                                    await sleep( parseInt( self.delay ) );
                                    switch_traffic_light( "red" );
                                    main_elem.querySelector("img.entry").src = self.images.car;
                                })();
                                this._space_index[ car.space_id() ] = car;
                                const newChild = car.image();
                                // in concurrent car replacements the oldChild might have been replaced in the meanwhile
                                garage_div.replaceChild( newChild, oldChild );
                                // car.enter();
                                ticket_hash.innerText = car.hash();
                                this.rerender();
                            } else { // space is occupied
                                if ( ! car.space || car.space === "0" ) debugger;
                                csv_post_event( 'occupied', car.toString() );
                                show_error( $.html( self.messages.occupied_slot, { id: car.space_id() } ) );
                            }
                        } else {
                            csv_post_event( 'invalid', car.toString() );
                            show_error( $.html( self.messages.invalid_slot, { id: car.space_id() } ) );
                        }
                    }
                    async removeCar( car ){
                        if ( self.open_from && parseInt( self.open_from ) > (new Date( simulationNow() )).getHours() ||
                            self.open_to && (new Date( simulationNow() )).getHours() > parseInt( self.open_to ) - 1 ) {
                            csv_post_event( 'closed', new Date( simulationNow() ).toLocaleString() );
                            show_error( $.html( { tag: 'li', inner: self.messages.parkhaus_closed } ) );
                            console.log( 'closed', new Date( simulationNow() ).toLocaleString() );
                        } else if ( car ){
                            delete this._car_index[ car.id() ];
                            delete this._space_index[ car.space_id() ];
                            car.leave();
                            if ( ! self.json_format || self.json_format === "false" ){
                                car._price = await csv_post_event( 'leave', ...car.toArray() );
                            } else {
                                car._price = await csv_post_event( 'leave', car.toJSON() );
                            }
                            addTableRow( car );
                            const oldChild = garage_div.querySelector('#' + car.space_id() );
                            const newChild = $.html( self.parking_space, { id: car.space_id(), nr: car.space } );
                            if ( oldChild ) garage_div.replaceChild( newChild, oldChild );
                            this.rerender();

                            const leavingCar = $.html( { inner: car.image() } );
                            leavingCar.style.display = 'inline-block';
                            exit_car_container.replaceChild( leavingCar, exit_car_container.firstElementChild );
                            leavingCar.innerHTML += '';
                            setTimeout(
                                () => {
                                    exit_car_container.replaceChild( exit_img, exit_car_container.firstElementChild );
                                },
                                5 * parseInt( self.delay )
                            );
                        }
                    }
                    image(){
                        garage_div.innerHTML = '';
                        for ( let i = 1; i <= this._max; i++ ){
                            garage_div.appendChild( $.html( self.parking_space, {
                                id: 'Space_' + i,
                                nr: i,
                                color: this.spaceColor( i )
                            } ) );
                        }
                        garage_div.innerHTML += '';
                    }
                    spaceColor( i ){
                        if ( self.space_color ){
                            for ( const key of Object.keys( self.space_color ) ){
                                if ( i >= parseInt( key ) ) return self.space_color[ key ];
                            }
                        }
                        return "black";
                    }
                    async add_image( more ){
                        if ( more === 0 ) return;
                        if ( more > 0 ){
                            for ( let i = this._max + 1; i <= this._max + more; i++ ){
                                garage_div.appendChild( $.html( self.parking_space, { id: 'Space_' + i, nr: i } ) );
                            }
                        } else { // more is a negative value
                            for ( let i = this._max; i > this._max + more; i-- ){
                                const space = garage_div.lastElementChild;
                                if ( space ){
                                    await garage.removeCar( garage._space_index[ space.id ] );
                                    garage_div.removeChild(garage_div.querySelector('#'+space.id));
                                    // ToDo garage_div.removeChild(space) => Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
                                }
                            }
                        }
                        this.rerender();
                        // garage_div.innerHTML += '';
                    }
                    randomSpace(){ // start with 1, end with max
                        return 1 + Math.floor(getRandom()*this.max);
                    }
                    updateHeader(){
                        header.counter.innerText = this.countCars();
                        header.free.innerText = this.freeSpace();
                    }
                    rerender(){
                        garage_div.innerHTML += ''; // SVG Hack: force re-rendering; Thereby loosing event handlers!
                        const rerenderedChilds = [...garage_div.querySelectorAll('.car' )];
                        rerenderedChilds.forEach( child => {
                            child.onclick = leave;
                            child.style.cursor = 'pointer';
                        });
                        this.updateHeader();
                    }
                    get random(){
                        // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
                        const keys = Object.keys( this._space_index );
                        return this._space_index[ keys[ keys.length * getRandom() << 0] ];
                    }
                    toString(){
                        return this._space_index.toString();
                    }
                }

                const garage = new Garage( parseInt( self.max ) );

                class Car {
                    constructor( spec ){
                        if ( spec ){
                            if ( typeof spec === 'string' ){
                                [ this.nr, this.timer, this._duration, this._price, this._hash, this._color, this.space, this.client_category, this.vehicle_type, this._license ] = spec.split("/");
                                [ 'nr', 'timer', '_duration', '_price', 'space' ].forEach( prop => this[prop] === '_' ? '_' : parseInt(this[prop]));
                            } else if ( typeof spec === 'object' ){
                                for ( const [ key, value ] of Object.entries( spec ) ){
                                    if ( [ 'hash', 'price', 'license', 'duration', 'color' ].includes( key ) ){
                                        this[ '_' + key ] = value;
                                    } else {
                                        this[ key ] = value;
                                    }
                                }
                                this._inGarage = false;
                            } else {
                                this.nr = spec;
                                this._inGarage = false;
                            }
                        } else {
                            this.nr = garage.nextTotal();  // because the car has not entered the car_index
                        }
                    }
                    clear(){
                        this._inGarage = false;
                        this.timer = (new Date()).getTime();
                        this._duration = 0;
                    }
                    id(){
                        return 'car_' + this.nr;
                    }
                    hash(){
                        if ( this._hash ) return this._hash;
                        return self.hash ? self.hash.md5( self.name + self.SALT + this.nr + this.timer ) : this.nr;
                    }
                    inGarage(){
                        return this._inGarage;
                    }
                    get license(){
                        if ( ! this._license ){
                            this._license = ( self.town || 'SU' ) + '-'
                                + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(26*Math.random()))
                                + ' '
                                + randomLicense();
                        }
                        return this._license;
                    }
                    get client_category(){
                        if ( self.client_categories && ! this._client_category ){
                            this._client_category = randomCategory();
                        }
                        return this._client_category;
                    }
                    set client_category( cat ){
                        this._client_category = cat;
                    }
                    get vehicle_type(){
                        if ( self.vehicle_types && ! this._vehicle_type ){
                            this._vehicle_type = randomVehicleType();
                        }
                        return this._vehicle_type;
                    }
                    set vehicle_type( type ){
                        this._vehicle_type = type;
                    }
                    get space(){
                        if ( ! this._space ) this.space = garage.randomSpace();
                        return this._space;
                    }
                    set space( nr ){
                        if ( nr ){
                            this._space = nr;
                        } else {
                            this._space = garage.randomSpace();
                        }
                    }
                    space_id(){
                        return 'Space_' + this.space;
                    }
                    static getList( s ){
                        if ( s && s.trim().startsWith('[') ){  // JSON
                            return JSON.parse( s ).map( spec => new Car( spec ) );
                        } else {  // CSV
                            const car_strings = s ? s.split(',') : [];
                            return car_strings.map( spec => new Car( spec ) );
                        }
                    }
                    enter(){
                        this._inGarage = true;
                        this._duration = 0;
                        this.timer = (new Date()).getTime(); // invariant: this.timer is always the begin time of parking
                    }
                    leave() {
                        this._inGarage = false;
                        this._duration = ( parseFloat( self.simulation_speed ) || 1 ) * ( (new Date()).getTime() - this.timer );
                        return this._duration;
                    }
                    gone(){
                        if ( typeof this._duration === 'number' && this._duration > 0 ) return true;
                        return ( typeof this.price() === 'number' && this.price() > 0 );
                    }
                    begin() { // invariant: this.timer is always the begin time of parking
                        return new Date( this.beginTime() ).toLocaleString();
                    }
                    beginTime(){
                        return simulationTime( this.timer );
                    }
                    end() {  // invariant: this.timer is always the begin time of parking
                        const endTime = this.beginTime() + parseInt( this._duration );
                        // console.log( 'begin ', this.beginTime(), ', end ', endTime, ', duration ', this._duration, ', diff ', endTime - this.beginTime() );
                        // console.log( 'begin ', new Date( this.beginTime() ).toLocaleString(), ', end ', new Date( endTime ).toLocaleString(), ', duration ', time( this._duration ), ', diff ', endTime - this.beginTime() );
                        return new Date( endTime ).toLocaleString();
                    }
                    duration() {  // ToDo 2000 msec => 01:00:02 ???
                        return new Date( this._duration ).toLocaleTimeString();
                    }
                    price_factor(){
                        let price_factor = self.price_factor;
                        if ( ! price_factor ) return 1;
                        if ( typeof price_factor === 'string' ){
                            price_factor = price_factor.trim();
                            if ( price_factor.startsWith('{') ){
                                price_factor = JSON.parse( price_factor );
                            } else {
                                price_factor = parseFloat( price_factor );
                            }
                        }
                        if ( typeof price_factor === 'number' ) return price_factor;
                        if ( typeof price_factor === 'object' ){
                            const client_price = price_factor[ this.client_category ];
                            const vehicle_price = price_factor[ this.vehicle_type ];
                            const client_vehicle_price = price_factor[ this.client_category + '.' + this.vehicle_type ];
                            if ( typeof client_vehicle_price === 'number' ) return client_vehicle_price;
                            if ( typeof client_price === 'number' ) return client_price;
                            if ( typeof vehicle_price === 'number' ) return vehicle_price;
                            return 1;
                        }
                        return 1;
                    }
                    price() {
                        if ( this._price ) return parseFloat( this._price );
                        return Math.round(this.price_factor() * this._duration / parseInt( self.simulation_speed ) );
                    }
                    color(){
                        if ( ! this._color ){
                            this._color = '#' + ('00000'+(getRandom()*(1<<24)|0).toString(16)).slice(-6);
                        }
                        return this._color;
                    }
                    toObject(){
                        return {
                            nr: this.nr,
                            timer: this.timer,
                            duration: this._duration,
                            price: this.price(),
                            hash: this.hash(),
                            color: this.color(),
                            space: this.space,
                            client_category: this.client_category,
                            vehicle_type: this.vehicle_type,
                            license: this.license,
                            begin: this.beginTime()
                        };
                    }
                    toJSON(){
                        return JSON.stringify( this.toObject(), null, 2 );
                    }
                    toTransferObject(){
                        return self.format === 'json' ? this.toJSON() : this.toCSV();
                    }
                    toArray(){
                        return [ this.nr, this.timer, this._duration, this.price(), this.hash(), this.color(), this.space, this.client_category, this.vehicle_type, this.license, this.beginTime() ].map( x => ( x || '_' ).toString() );
                    }
                    toCSV(){
                        this.toArray().join(',');
                    }
                    tooltip(){
                        return this.toArray().join(',');
                    }
                    image(){
                        return $.html( self.car, {
                            id: this.space_id(),
                            nr: this.license,
                            color: this.color(),
                            tooltip: this.tooltip()
                        });
                    }
                    toString(){
                        return `Car(${this.nr})`; // return `new Car(${this.toJSON()})`;
                    }
                }

                class ClientList {
                    constructor( max ){
                        const maxNumber = parseInt( max );
                        this._list = [];
                        for (let i = 0; i< maxNumber; i++){
                            this._list.push( new Car( i + 1 ) );
                        }
                        console.log( maxNumber, ' cars generated.' );
                    }
                    nextCar(){
                        const extern = this.externalCars();
                        return extern.length > 0 ?  extern[ getRandomInt( extern.length ) ] : null;
                    }
                    externalCars(){
                        return this._list.filter( car => ! car.inGarage() );
                    }
                }

                const clientMap = new ClientList( Math.abs( parseInt( self.license_max ) - parseInt( self.license_min || 0 ) ) || 10 * parseInt( self.max ) );

                // render content to website
                // $.setContent( self.element, main_elem );
                self.element.textContent = '';
                self.element.appendChild( main_elem );
                if ( self.background_color ) self.element.style['background-color'] = self.background_color;

                // load config from server
                // =======================
                // max: 20, // maximum number of parking slots
                // open_from: 6,
                // open_to: 24,
                // delay: 100

                const config_string = await csv_get_request( "config", { name: self.name } );
                if ( config_string && config_string.length > 1 ){
                    const [ max, open_from, open_to, delay, time_shift ] = config_string.split(',');
                    const config = { max: parseInt(max), open_from: parseInt(open_from), open_to: parseInt(open_to), delay: parseInt(delay), time_shift: BigInt( time_shift ) };
                    garage.max = parseInt( max );
                    // merge into component config (self)
                    Object.assign(self, config);
                    // update header
                    Object.keys( header ).forEach( className => {
                        if ( header[ className ] ) header[ className ].value = config[ className ];
                    });
                    garage.image();
                    garage.rerender();
                    // has logger instance? => log 'render' event
                    if ( self.logger ) self.logger.log( 'render', config );
                }

                // ======= get cars from server =======
                const car_string = await csv_get_request( "cars", { name: self.name } );
                const car_list = Car.getList( car_string );
                Object.assign(self, { cars: car_list });
                car_list.filter( car => ! car.gone() ).forEach( car => garage.driveCarIntoSpace( car ) );
                car_list.filter( car =>   car.gone() ).forEach( car => addTableRow(   car ) );
                garage.total = car_list.length;
                garage.updateHeader();

                if ( self.no_keyboard ){
                    for ( const input of self.element.querySelectorAll('input') ){
                        input.onkeydown = _=> false;
                    }
                }

                // event handler for input elements
                async function oninput( e ) {
                    const newValue = parseInt(this.value) || 0;
                    csv_post_event('change_' + this.classList.toString(), self[this.classList.toString()], this.value);
                    self[ this.classList.toString() ] = newValue;
                    switch( this.classList.toString() ){
                        case "max":
                            await garage.add_image( newValue - garage.max );
                            garage.max = newValue;
                            garage.rerender();
                            break;
                        case "open_from": case "open_to":
                            // ToDo
                            break;
                        default:
                            debugger;
                    }
                }

                // render traffic light
                const traffic_light_span = main_elem.querySelector( 'span.traffic_light' );
                traffic_light_span.appendChild( $.html( self.traffic_light ) );
                traffic_light_span.innerHTML += ''; // SVG Hack
                const traffic_lights = {};
                ["red","yellow","green"].forEach(light=>{
                    traffic_lights[light] = traffic_light_span.querySelector('#' + light);
                });
                switch_traffic_light( "red" ); // init

                function switch_traffic_light( color ){
                    switch_off_traffic_lights();
                    traffic_lights[color].style = `fill: ${color};`;
                }

                function switch_off_traffic_lights(){
                    ["red","yellow","green"].forEach(light=>{
                        traffic_lights[light].style = "fill: rgb(200, 160, 160);"
                    });
                }

                // insert extra buttons
                const extra_div = main_elem.querySelector( '.extra_buttons' );
                if ( self.extra_buttons ){
                    self.extra_buttons.forEach( extra_params => {
                        if ( typeof extra_params === "string" ){
                            const extra_string = extra_params;
                            extra_params = {
                                "extra_class": extra_string,
                                "extra_inner": extra_string,
                                "extra_popup_title": extra_string
                            };
                        }
                        const extra_sub_div = $.html( self.html.extra_button_div, extra_params );
                        extra_div.appendChild( extra_sub_div );
                        const extra_button = extra_sub_div.querySelector('button');
                        const extra_span = extra_sub_div.querySelector('span');
                        extra_button.addEventListener('click', async function( e ){
                            if ( extra_button.classList.contains( 'start' ) ){
                                if ( extra_button.classList.length > 1 ) extra_button.classList.remove( 'start' );
                                await csv_get_request( extra_button.classList.toString().replaceAll(/\s/g,'_'), { name: self.name }, extra_span );
                                setTimeout( _=>{ stop(); self.start() }, 800 );
                            } else {
                                await csv_get_request( extra_params.extra_class, { name: self.name }, extra_span );
                            }
                        });
                    });
                }

                // insert extra charts
                const extra_charts = main_elem.querySelector( '.extra_charts' );
                if ( self.extra_charts ){
                    self.extra_charts.forEach(extra_params => {
                        if ( typeof extra_params === "string" ){
                            const extra_string = extra_params;
                            extra_params = {
                                "extra_class": extra_string,
                                "extra_inner": extra_string,
                                "extra_popup_title": extra_string
                            };
                        }
                        const extra_sub_div = $.html( self.html.extra_chart_div, extra_params );
                        extra_charts.appendChild( extra_sub_div );
                        const extra_chart = extra_sub_div.querySelector('button');
                        const checkbox = extra_sub_div.querySelector('input');
                        checkbox.checked = true;
                        checkbox.style.display = 'none';
                        checkbox.addEventListener('click', function(e){
                            if ( extra_div.style.display === 'none' ){
                                extra_div.style.display = 'block';
                            } else {
                                extra_div.style.display = 'none';
                            }
                        });
                        const extra_div = extra_sub_div.querySelector('div');
                        extra_chart.addEventListener('click',async function( e ){
                            let config, response;
                            try {
                                response = await csv_get_request( extra_params.extra_class, { name: self.name } );
                                if ( response ){
                                    try {
                                        config = JSON.parse( response );
                                        config.root = extra_div;
                                        self.chart.start( config );
                                        checkbox.style.display = 'inline';
                                    } catch (err2){
                                        console.log( err2, " in HTTP Response: ", response );
                                    }
                                } else {
                                    console.log( 'No HTTP-GET handler for ' + extra_params.extra_class );
                                }
                            } catch( err1 ){
                                show_error( "GET " + extra_params.extra_class + ": " + err1.toString() + "<br>" + response )
                            }
                        });
                    });
                }

                function simulationTime( realTime ){
                    const startTime = BigInt( self.time_shift || 0 );
                    const result = BigInt( self.simulation_speed || 1 ) * BigInt( realTime ) - startTime;
                    const intResult = Number( result );
                    const resultTime = new Date( intResult );  // for debugging only
                    return intResult;
                }

                function simulationNow(){
                    return simulationTime( new Date().getTime() );
                }

                async function enter( e ) {
                    if ( garage.countCars() >= garage.max ){
                        alert( self.messages.parkhaus_full );
                        show_error( $.html( { tag: 'li', inner: self.messages.parkhaus_full } ) );
                    } else if ( self.open_from && parseInt( self.open_from ) > (new Date( simulationNow() )).getHours() ||
                        self.open_to && (new Date( simulationNow() )).getHours() > parseInt( self.open_to ) - 1 ) {
                        alert( self.messages.parkhaus_closed );
                        show_error( $.html( { tag: 'li', inner: self.messages.parkhaus_closed } ) );
                    } else {
                        const nextCar = clientMap.nextCar();
                        if ( nextCar ) await garage.addCar( nextCar );
                    }
                }

                async function leave( e ) {
                    const chosen_car = garage.getCarBySpace( this.id );
                    if ( chosen_car ){
                        await garage.removeCar( chosen_car );
                    } else {
                        console.error('Leave event in empty garage!');
                    }
                }

                function addTableRow( car ){
                    if ( table ) table.appendChild( $.html( self.html.row, {
                            nr: car.nr,
                            von: car.begin(),
                            bis: car.end(),
                            dauer: time( car._duration ),
                            ctyp: car.client_category,
                            vtyp: car.vehicle_type,
                            ticket: car.hash(),
                            license: car.license,
                            color: car.color(),
                            space: car.space,
                            preis: ' € ' + ( car.price() / 100 ).toFixed(2) }
                        )
                    );
                }

                function time( nr ){
                    const msec = ""+nr % 1000; nr /= 1000; nr = Math.floor( nr );
                    const sec = ""+nr % 60; nr /= 60; nr = Math.floor( nr );
                    const min = ""+nr % 60; nr /= 60; nr = Math.floor( nr );
                    const hours = ""+nr % 24; nr /= 24; nr = Math.floor( nr );
                    if ( nr === 0 && hours === '0' && min === '0' && sec === '0' ) return `0.${msec.padStart(3, '0')}`;
                    if ( nr === 0 && hours === '0' ) return `${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
                    if ( nr === 0 ) return `${hours.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`; // .${msec.padStart(3, '0')}
                    const days = ""+nr;
                    return `${days}.${hours.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`; // .${msec.padStart(3, '0')}
                }

                async function csv_get_request( command, params, extra_span ){
                    if ( self.server_url ){
                        const request = new Request( self.server_url
                            + '?cmd=' + command
                            + Object.entries( params ).map(([key, value])=>'&'+key+'='+value).join()
                        );
                        console.log( request );
                        try {
                            const response = await fetch( request, {
                                method: 'GET',
                                mode: 'cors',
                                cache: 'no-store',
                                headers:{
                                    'Content-Type': 'text/html'
                                }
                            });
                            if (!response.ok) console.error( response.statusText ) // or check for response.status
                            // process body
                            const response_string = (await response.text()).trim();
                            return command_interpreter( response_string, extra_span );
                        } catch (err) {
                            console.error(err, request);
                            // show_error( "<p>" + request.url + " failed.<br>" + err + "</p>" );
                        }
                    } else {
                        // console.log( "No server_url" );
                    }
                }

                async function csv_post_request( command, params, extra_span ){
                    if ( self.server_url ){
                        const headers = new Headers();
                        const formData = new FormData();
                        formData.append( 'cmd', command );
                        Object.entries( params ).forEach( ([key, value])=> {
                            formData.append( key, value );
                        });
                        // headers.append("Content-Type", "multipart/form-data");
                        headers.append("Content-Type", "application/x-www-form-urlencoded");
                        // headers.append("Content-Length", formData.length.toString());
                        const response = await fetch( new Request( self.server_url ), {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-store',
                            body: formData,
                            headers: headers
                        });
                        const response_string = (await response.text()).trim();
                        return command_interpreter( response_string, extra_span );
                    } else {
                        console.error( "No server_url" );
                    }
                }

                async function csv_post_event( event, ...values ){
                    if ( self.server_url ){
                        const request = [ event, ...values ].join(",");
                        const response = await fetch( new Request( self.server_url ), {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-store',
                            body: request,
                            headers:{
                                'Content-Type': 'text/plain'
                            }
                        }).catch( err => { console.error( err ); return { text: _=> err } } );
                        const response_string = (await response.text()).trim();
                        const result = command_interpreter( response_string );
                        console.log( request, " => ", result );
                        // const lastHash = self.ccm.allHashes[ values[ 4 ] ];
                        // if ( self.debug && event === 'enter' && lastHash && lastHash.nr === values[ 0 ] && lastHash.begin !== values[ 1 ] ) debugger;
                        // self.ccm.allHashes[ values[ 4 ] ] = { nr: values[ 0 ], begin: values[ 1 ] };
                        if ( result === 0 || result === "0" ) debugger;
                        return result;
                    } else {
                        // console.log( "No server_url" );
                    }
                }

                function command_interpreter( response_string, extra_span ){
                    if ( response_string.indexOf('HTTP Status') >= 0 ){ // error
                        show_error( response_string );
                    } else { // generic interpreter for server responses: Where? What? Params...
                        const [ selector, command, ...content ] = response_string.split(',');
                        if ( main_elem && /^[.#A-Za-z_]\w*$/.test(selector) ){
                            if ( selector.startsWith('#') ){ // identifier for single element
                                if ( main_elem.querySelector( selector ) ){
                                    if ( command === "insertHTML"  ){
                                        main_elem.querySelector( selector ).innerHTML = content;
                                    } else {
                                        main_elem.querySelector( selector ).innerText = content;
                                    }
                                } else {
                                    console.log( 'selector ' + selector + ' not found.' );
                                }
                            } else {
                                Array.from( main_elem.querySelectorAll( selector ) ).forEach( elem => {
                                    if ( command === "insertHTML"  ){
                                        elem.innerHTML = content;
                                    } else {
                                        elem.innerText = content;
                                    }
                                });
                            }
                        } else if ( extra_span ) {
                            extra_span.innerHTML = response_string;
                        } else {
                            return response_string;
                        }
                    }
                }

                let interval;

                function start_simulation( e ){
                    if ( ! simulationIsRunning ){  // Do not allow for more than one simulation at the same time
                        simulationIsRunning = true;
                        csv_get_request( "start", { name: self.name } );
                        const simulation = typeof self.simulation === 'string' ? JSON.parse( self.simulation ) : self.simulation;
                        interval = setInterval(
                            async () => {
                                const enterOrLeave = getRandomInt( simulation.max );
                                if ( enterOrLeave < simulation.enter ){
                                    const nextCar = clientMap.nextCar();
                                    if ( nextCar ) await garage.addCar( nextCar );
                                } else {
                                    const oldCar = garage.random;
                                    await garage.removeCar( oldCar );
                                }
                            },
                            simulation.delay * parseInt( self.delay )
                        );
                    }
                }

                function stop( e ){
                    clearInterval( interval );
                    simulationIsRunning = false;
                    csv_get_request( "stop", { name: self.name } );
                }

                /**
                 * generate random integer
                 * @returns integer between min and max-1
                 * @param min - lower limit inclusive, optional (default 0)
                 * @param max - upper limit exclusive
                 **/
                function getRandomInt(max, min) {
                    if ( ! min ) min = 0;
                    return min + Math.floor(getRandom() * Math.floor(max-min));
                }

                async function sleep( msec ) {
                    return new Promise(resolve => setTimeout(resolve, msec));
                }

                function show_error( message ){
                    if ( ! self.debug || self.debug === "false" ) return;
                    if ( typeof message === 'string' ){
                        error_div.innerHTML += message;
                    } else {
                        error_div.appendChild( message );
                    }
                    if ( self.debug ) error_div.style.display = 'block';
                }

                function randomCategory(){
                    if ( self.client_categories ){
                        return self.client_categories[ getRandomInt(self.client_categories.length) ];
                    } else {
                        return 'any';
                    }
                }

                function randomVehicleType(){
                    if ( self.vehicle_types ){
                        return self.vehicle_types[ getRandomInt(self.vehicle_types.length) ];
                    } else {
                        return 'any';
                    }
                }

                function randomLicense(){
                    return 1 + getRandomInt( parseInt( self.license_max ) || 100, parseInt( self.license_min ) || 0 );
                }

                function getRandom(){
                    let result = Math.random();
                    if ( self.random_start ){
                        const randomStart = Math.abs( parseInt( self.random_start ) );
                        for ( let i = randomStart; i > 0; i-- ){
                            result = Math.random();
                        }
                    }
                    return result;
                }

            };

        }

    };

    let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
}() );
