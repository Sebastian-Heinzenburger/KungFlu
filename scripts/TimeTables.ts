///<reference path="Tsketch.ts"/>
let timetables: PathFinderNode[][][]
let tables: PathFinderNode[][]
let hotspots: PathFinderNode[][]
let greatBreak: PathFinderNode[][]
let exit: PathFinderNode[]

let shortBreakDuration = 10;
let BreakDuration = 10;
let Lessonduration = 10;
let homeDuration = 10;

function initTimetables() {
    tables = [
        [
            globalNodes[2][5],
            globalNodes[5][5],
            globalNodes[2][7],
            globalNodes[7][7],
            globalNodes[3][9],
            globalNodes[6][9],
        ],
        [
            globalNodes[23][4],
            globalNodes[26][4],
            globalNodes[26][5],
            globalNodes[23][7],
            globalNodes[30][4],
            globalNodes[30][8],
        ],
        [
            globalNodes[4][19],
            globalNodes[6][19],
            globalNodes[4][17],
            globalNodes[5][17],
            globalNodes[3][17],
            globalNodes[7][15],
        ],
        [
            globalNodes[24][16],
            globalNodes[24][15],
            globalNodes[29][16],
            globalNodes[29][15],
            globalNodes[29][14],
            globalNodes[24][14],
        ]
    ];


    hotspots = [
        [
            globalNodes[5][6],
            globalNodes[5][6],
            globalNodes[5][6],
            globalNodes[5][6],
            globalNodes[5][6],
            globalNodes[5][6],
        ],
        [
            globalNodes[26][6],
            globalNodes[26][6],
            globalNodes[26][6],
            globalNodes[26][6],
            globalNodes[26][6],
            globalNodes[26][6],
        ],
        [
            globalNodes[5][17],
            globalNodes[5][17],
            globalNodes[5][17],
            globalNodes[5][17],
            globalNodes[5][17],
            globalNodes[5][17],
        ],
        [
            globalNodes[24][16],
            globalNodes[24][16],
            globalNodes[24][16],
            globalNodes[24][16],
            globalNodes[24][16],
            globalNodes[24][16],
        ],

    ];

    greatBreak = [
        [
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[10][0],
            globalNodes[19][16],
        ],
        [
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[19][11]
        ],
        [
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[32][8]
        ],
        [
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[14][7],
            globalNodes[19][16],
            globalNodes[15][0]
        ]
    ]


    exit = [
        globalNodes[14][21],
        globalNodes[15][21],
        globalNodes[14][21],
        globalNodes[15][21],
        globalNodes[14][21],
        globalNodes[15][21],
    ]


    timetables = [
        [
            tables[0],
            hotspots[1],
            tables[1],
            hotspots[1],
            tables[1],
            greatBreak[0],
            hotspots[2],
            tables[2],
            hotspots[2],
            tables[2],
            tables[3],
            exit
        ],
        [
            tables[1],
            hotspots[2],
            tables[2],
            hotspots[2],
            tables[2],
            greatBreak[1],
            hotspots[3],
            tables[3],
            hotspots[3],
            tables[3],
            tables[0],
            exit
        ],
        [
            tables[2],
            hotspots[3],
            tables[3],
            hotspots[3],
            tables[3],
            greatBreak[2],
            hotspots[0],
            tables[0],
            hotspots[0],
            tables[0],
            tables[1],
            exit
        ],
        [
            tables[3],
            hotspots[0],
            tables[0],
            hotspots[0],
            tables[0],
            greatBreak[3],
            hotspots[1],
            tables[1],
            hotspots[1],
            tables[1],
            tables[2],
            exit
        ]
    ]


}
