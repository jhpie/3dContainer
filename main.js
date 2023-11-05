import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

// 상자 - 래인을 추적하기 위한 배열
var cells = [];
var selectedLanes = [];
var selectedRack = "";
// 창고의 레인과 칼럼 정보를 정의
const lanes = [
    {
        lane: "1",
        columns: [
            {
                column: "A",
                racks: [
                    {
                        floor: 1, // total floor of the rack,
                        row: "AAA",
                    },
                    {
                        floor: 3, // total floor of the rack,
                        row: "AAB",
                    },
                    {
                        floor: 4, // total floor of the rack,
                        row: "AAC",
                    },
                    {
                        floor: 5, // total floor of the rack,
                        row: "AAD",
                    },
                ],
            },
            {
                column: "AAB",
                racks: [
                    {
                        floor: 2, // total floor of the rack,
                        row: "AAA",
                    },
                ],
            },
        ],
    },
    {
        lane: "2",
        columns: [
            {
                column: "AAC",
                racks: [
                    {
                        floor: 3, // total floor of the rack,
                        row: "AAA",
                    },
                ],
            },
            {
                column: "AAD",
                racks: [
                    {
                        floor: 4, // total floor of the rack,
                        row: "AAA",
                    },
                ],
            },
        ],
    },
];
//렉에 대한 정보를 정의
let rack = [
    {
        row: "AAA",
        column: "AAA",
        floor: 1,
        lane: 2,
    },
    {
        row: "AAB",
        column: "AAA",
        floor: 1,
        lane: 2,
    },
    {
        row: "AAC",
        column: "AAA",
        floor: 1,
        lane: 2,
    },
    {
        row: "AAD",
        column: "AAA",
        floor: 3,
        lane: 2,
    },
    {
        row: "AAE",
        column: "AAA",
        floor: 3,
        lane: 2,
    },
];
//상자를 그리는 함수
var drawRack = function (
    floor,
    size,
    index,
    extra,
    depthStart,
    depthEnd,
    lane
) {
    for (let i = 1; i <= floor; i++) {
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 2,
        });
        var points = [];

        points.push(
            new THREE.Vector3(
                -size + index * size * 3,
                i * size - size,
                depthStart
            )
        );
        points.push(
            new THREE.Vector3(
                size + index * size * 3,
                i * size - size,
                depthStart
            )
        );
        points.push(
            new THREE.Vector3(
                size + index * size * 3,
                i * size - size,
                depthEnd
            )
        );
        points.push(
            new THREE.Vector3(
                -size + index * size * 3,
                i * size - size,
                depthEnd
            )
        );
        points.push(
            new THREE.Vector3(
                -size + index * size * 3,
                i * size - size,
                depthStart
            )
        );

        points.push(
            new THREE.Vector3(-size + index * size * 3, i * size, depthStart)
        );
        points.push(
            new THREE.Vector3(size + index * size * 3, i * size, depthStart)
        );
        points.push(
            new THREE.Vector3(
                size + index * size * 3,
                i * size - size,
                depthStart
            )
        );
        points.push(
            new THREE.Vector3(size + index * size * 3, i * size, depthStart)
        );
        points.push(
            new THREE.Vector3(size + index * size * 3, i * size, depthEnd)
        );
        points.push(
            new THREE.Vector3(
                size + index * size * 3,
                i * size - size,
                depthEnd
            )
        );
        points.push(
            new THREE.Vector3(
                -size + index * size * 3,
                i * size - size,
                depthEnd
            )
        );
        points.push(
            new THREE.Vector3(-size + index * size * 3, i * size, depthEnd)
        );
        points.push(
            new THREE.Vector3(-size + index * size * 3, i * size, depthStart)
        );
        points.push(
            new THREE.Vector3(-size + index * size * 3, i * size, depthEnd)
        );
        points.push(
            new THREE.Vector3(size + index * size * 3, i * size, depthEnd)
        );

        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, material);

        var geometry = new THREE.BoxGeometry(
            size * 2 - size * 0.1,
            size - size * 0.1,
            size - size * 0.1
        );
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = index * size * 3;
        cube.position.y = (size - 1) * (2 * i - 1);
        cube.position.z = depthStart + 1;
        cube.userData.extra = extra;
        cube.userData.actualFloor = i;
        cube.userData.lane = lane;
        cells.push(cube);
        scene.add(cube);
        scene.add(line);
    }
};

//칼럼을 그리는 함수
var drawColumn = function (
    col,
    colIndex,
    curLane,
    size,
    laneRack,
    colCode,
    lane
) {
    let depthStart = laneRack[0];
    let depthEnd = laneRack[1];
    drawColumnText(colCode, colIndex, laneRack[0]);

    for (let i = 0; i < col.length; i++) {
        let extra = {
            ...col[i],
            colCode,
        };

        drawRack(col[i].floor, size, i, extra, depthStart, depthEnd, lane);
    }
};

//레인에 대한 텍스트를 그리는 함수
var drawLaneText = function (i, end, space) {
    var loader = new THREE.FontLoader();

    loader.load("fonts/helvetiker.typeface.json", function (font) {
        var fontSize = 1;
        var lane = new THREE.TextGeometry(`Lane ${i}`, {
            font: font,
            size: fontSize,
            height: 0.1,
        });

        var textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

        var mesh = new THREE.Mesh(lane, textMaterial);
        mesh.position.x = -5;
        mesh.position.z = end - fontSize / 2 + space / 2;
        // mesh.position.z = size + (i - 1) * (size + space) + space / 2;
        mesh.rotation.x = -1.5708;
        mesh.rotation.z = 3.14159;

        scene.add(mesh);
    });
};
// 칼럼에 대한 텍스트를 그리는 함수
var drawColumnText = function (i, index, start) {
    var loader = new THREE.FontLoader();
    loader.load("fonts/helvetiker.typeface.json", function (font) {
        var fontSize = 0.7;
        var lane = new THREE.TextGeometry(`${i}`, {
            font: font,
            size: fontSize,
            height: 0.1,
        });

        var textMaterial = new THREE.MeshBasicMaterial({
            color: 0x5a5a5a,
        });

        var mesh = new THREE.Mesh(lane, textMaterial);
        mesh.position.x = -3;
        mesh.position.z = (start + fontSize) ;
        mesh.rotation.x = -1.5708;
        mesh.rotation.z = 3.14159;

        scene.add(mesh);
    });
};
// 레인을 그리는 메인 함수
var drawLane = function (lanes) {
    let curLane = 1;

    let size = 2;
    let depth = 2;
    let space = 5;
    let laneGap = size * 2 + space;

    for (let i = 0; i < lanes.length; i++) {
        lanes[i].columns.map((col, colIndex) => {
            if (colIndex == 0) {
                let laneRack = [
                    (curLane - 1) * laneGap,
                    (curLane - 1) * laneGap + depth,
                ];
                drawLaneText(lanes[i].lane, laneRack[1], space);

                drawColumn(
                    col.racks,
                    colIndex,
                    curLane,
                    size,
                    laneRack,
                    col.column,
                    lanes[i].lane
                );
            } else {
                let laneRack = [
                    (curLane - 1) * laneGap + depth + space,
                    (curLane - 1) * laneGap + depth * 2 + space,
                ];
                drawColumn(
                    col.racks,
                    colIndex,
                    curLane,
                    size,
                    laneRack,
                    col.column,
                    lanes[i].lane
                );
            }
        });
        curLane++;
    }
};
// Three.js의 Scene, Camera, Renderer 설정
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
// 카메라의 초기 위치 설정
camera.position.x = 35;
camera.position.y = 35;
// 레인 선택 체크 박스의 상태를 확인하는 함수
function checkLanes() {
    var checkedLanes = document.getElementsByClassName("LaneOption");
    var newSelectedLanes = [];
    for (var i = 0; i < checkedLanes.length; i++) {
        if (checkedLanes[i].checked) {
            newSelectedLanes.push(i + 1);
        }
    }
    selectedLanes = newSelectedLanes;
    if (newSelectedLanes.length > 0) {
        let filteredCellsByLanes = cells.filter((cell) => {
            return newSelectedLanes.includes(parseInt(cell.userData.lane));
        });
        filteredCellsByLanes.map((v, i) => {
            var material = new THREE.MeshBasicMaterial({ color: 0xff8500 });
            filteredCellsByLanes[i].material = material;
        });
    } else {
        cells.map((v, i) => {
            var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            cells[i].material = material;
        });
    }
}

var card = document.createElement("div");
var collapsebtn = document.createElement("button");
var collapseContent = document.createElement("div");
var collapseContentContainer = document.createElement("div");

var text = document.createElement("span");
var text2 = document.createElement("span");

// card 1 style
card.className = "card card-body";
card.style.position = "absolute";
card.style.display = "flex";
card.style.justifyContent = "center";
card.style.alignItems = "center";
card.style.textAlign = "center";
card.style.flexWrap = "wrap";
card.style.width = parseInt(window.innerWidth * 0.2) + "px";
card.style.height = parseInt(window.innerHeight * 0.05) + "px";
card.style.top = 200 + "px";
card.style.left = 200 + "px";

//collapsebtn style
collapsebtn.className = "btn btn-primary";
collapsebtn.type = "button";
collapsebtn.setAttribute("data-toggle", "collapse");
collapsebtn.setAttribute("data-target", "#collapseContent");
collapsebtn.setAttribute("aria-expanded", "false");
collapsebtn.setAttribute("aria-controls", "collapseContent");
collapsebtn.style.position = "absolute";
collapsebtn.style.display = "flex";
collapsebtn.style.justifyContent = "center";
collapsebtn.style.alignItems = "center";
collapsebtn.style.textAlign = "center";
collapsebtn.style.flexWrap = "wrap";
collapsebtn.style.width = parseInt(window.innerWidth * 0.2) + "px";
collapsebtn.style.height = parseInt(window.innerHeight * 0.05) + "px";
collapsebtn.style.top = 200 + "px";
collapsebtn.style.right = 200 + "px";

//collapseContent style
collapseContent.className = "collapse";
collapseContent.id = "collapseContent";
collapseContent.style.position = "absolute";
collapseContent.style.width = parseInt(window.innerWidth * 0.2) + "px";
collapseContent.style.top =
    200 + parseInt(window.innerHeight * 0.05) + "px";
collapseContent.style.right = 200 + "px";

//collapseContentContainer style
collapseContentContainer.className = "card card-body";
collapseContentContainer.style.width =
    parseInt(window.innerWidth * 0.2) + "px";

//text style
text2.style.fontSize = parseInt(window.innerWidth * 0.013) + "px";
text2.style.fontFamily = "Roboto";
text2.style.fontWeight = "bold";
text2.innerHTML = `Filter Options`;

text.style.fontSize = parseInt(window.innerWidth * 0.013) + "px";
text.style.fontFamily = "Roboto";
text.style.fontWeight = "bold";
text.innerHTML = `Rack : ${"not selected"}`;

//lanes
var laneGroup = document.createElement("div");
var laneGroupTitle = document.createElement("p");
var laneGroupContainer = document.createElement("div");
var laneGroupInnerContainer = document.createElement("div");
laneGroupContainer.className = "container";
laneGroupInnerContainer.className = "row";

laneGroupTitle.innerHTML = "Lanes";
laneGroupTitle.style.fontSize =
    parseInt(window.innerWidth * 0.011) + "px";
laneGroupTitle.style.fontFamily = "Roboto";
laneGroupTitle.style.fontWeight = "bold";
laneGroup.style.padding = 5 + "px";
laneGroup.style.margin = 5 + "px";

lanes.map((lane) => {
    var el = lane.lane;
    var newCol = document.createElement("div");
    newCol.className = "col-sm form-check";
    var selectBox = document.createElement("input");
    selectBox.className = "LaneOption";
    selectBox.type = "checkbox";
    selectBox.id = `Lane${el}`;
    selectBox.style.height = parseInt(window.innerHeight * 0.013) + "px";
    selectBox.style.width = parseInt(window.innerWidth * 0.013) + "px";
    selectBox.onclick = checkLanes;
    var selectBoxLabel = document.createElement("label");
    selectBoxLabel.className = "form-check-label";
    selectBoxLabel.htmlFor = `Lane${el}`;
    selectBoxLabel.innerHTML = `Lane ${el}`;
    selectBoxLabel.style.fontSize =
        parseInt(window.innerWidth * 0.013) + "px";
    newCol.appendChild(selectBox);
    newCol.appendChild(selectBoxLabel);
    laneGroupInnerContainer.appendChild(newCol);
});

laneGroup.appendChild(laneGroupTitle);
laneGroupContainer.appendChild(laneGroupInnerContainer);
laneGroup.appendChild(laneGroupContainer);
collapseContentContainer.appendChild(laneGroup);

card.appendChild(text);
collapsebtn.appendChild(text2);
collapseContent.appendChild(collapseContentContainer);

document.body.appendChild(card);
document.body.appendChild(collapsebtn);
document.body.appendChild(collapseContent);

var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.domElement.addEventListener("click", onDocumentMouseDown, true);
var controls = new OrbitControls(camera, renderer.domElement);

function onDocumentMouseDown(event) {
    event.preventDefault();
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(cells);
    if (intersects.length > 0) {
        let code = `CHR-${intersects[0].object.userData.extra.colCode}-${intersects[0].object.userData.extra.row}-${intersects[0].object.userData.actualFloor}`;
        console.log(code);
    }
}

function onDocumentMouseMove(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var notFilteredCells = cells;
    var filteredCells = cells;

    var intersects = raycaster.intersectObjects(cells);

    if (selectedLanes.length > 0) {
        notFilteredCells = notFilteredCells.filter((cell) => {
            return !selectedLanes.includes(parseInt(cell.userData.lane));
        });
        filteredCells = filteredCells.filter((cell) => {
            return selectedLanes.includes(parseInt(cell.userData.lane));
        });
        filteredCells.map((v, i) => {
            var material = new THREE.MeshBasicMaterial({ color: 0xff8500 });
            filteredCells[i].material = material;
        });
    }
    notFilteredCells.map((v, i) => {
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        notFilteredCells[i].material = material;
    });

    if (intersects.length > 0) {
        $("html,body").css("cursor", "pointer");
        let first = intersects[0];
        let index = cells.findIndex(
            (e) => first.object.geometry.uuid === e.geometry.uuid
        );
        var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        cells[index].material = material;
        let code = `CHR-${intersects[0].object.userData.extra.colCode}-${intersects[0].object.userData.extra.row}-${intersects[0].object.userData.actualFloor}`;
        selectedRack = code;
        text.innerHTML = `Rack : ${selectedRack}`;
    } else {
        $("html,body").css("cursor", "default");
        text.innerHTML = `Rack : ${"Not Selected"}`;
    }
}
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.add(new THREE.GridHelper(500, 50));
// 레인을 그림
drawLane(lanes);
camera.position.z = 5;
document.addEventListener("mousemove", onDocumentMouseMove, false);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
// 애니메이션을 위한 렌더 루프
var animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();