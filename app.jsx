import React from 'react';
import ReactDOM from 'react-dom';


const createArray = (size) =>
    Array.from({ length: size }, (_, i) => i);

class Cell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: this.props.widthPercentage,
            terrain: this.props.terrain,
            moveMade: false
        }
    }

    dropThis = (e)=>{
        let classy = this.props.dropUnit();
        let imgLocation = e.target.children[0];
        console.log(this.state.moveMade);
        if (this.state.moveMade === true){
            console.log("Wykonałeś ruch")
        } else if (e.target.parentElement.dataset.rowid > 7 || e.target.parentElement.dataset.rowid < 2){
            imgLocation.setAttribute("src", `${classy}`);
            imgLocation.setAttribute("display", "block");
            imgLocation.setAttribute("width", "100%");
            this.props.handleSingleMove();
            this.setState({
                moveMade: true
            });

        } else if (e.target.parentElement.dataset.rowid > 1 && e.target.parentElement.dataset.rowid <8) {
            console.log('Rozstaw jednostki w dwóch pierwszych rzędach')
        }
        this.handlePlayerChange();
    };


    handleBoardMoves= (e) => {
        if (this.state.moveMade === true) {
            console.log("Ruch wykonany")
        }
        else {
            console.log(this.state.moveMade);
            if (e.target.parentElement.classList[1]!== undefined) {
                console.log("jest tu jednostka");
            } else if (e.target.classList[1] === "normal" || e.target.classList[1] === "forest" || e.target.classList[1] === "hills"){
                this.dropThis(e);
                this.setState({
                    moveMade: true
                })
            }
            else {
                console.log("teren się NIE zgadza");
                console.log(e.target.parentElement.classList[0]);
                console.log(e.target.parentElement.children.length);
            }
            console.log(this.state.moveMade)
        }
    };


    render() {
        console.log(this.props.widthPercentage);
        return (
                <div onClick={this.handleBoardMoves}
                     className={`cell ${this.props.terrain}`}
                     style={{
                         width: `${this.state.width}%`,
                         height: `${Number(this.state.width) * 10}`,
                     }}
                >
                    <img />
                </div>
        );
    }
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moveMade: false
        }
    }
    grid = createArray(this.props.gridSize);
    cellWidthPercentage = 100 / this.props.gridSize;

    handleSingleMoveInTurn = () => {
      this.setState({
          moveMade: true
      })
    };

    handlerDropUnitOnBoard = () => {
        let classOfUnit = this.props.selectedUnit();
        let showMe;
        //e.target.classList.add(`${classOfUnit}`);
        if (classOfUnit === "archer"){
            showMe = "../images/archer.png";
            console.log("jestem")
        } else if (classOfUnit === "cavalry"){
            showMe = "../images/cavalry.png"
        } else if (classOfUnit === "crossbowman"){
            showMe = "../images/crossbowman.png"
        } else if (classOfUnit === "spearmen"){
            showMe = "../images/spearmen.png"
        } else if (classOfUnit === "infantry"){
            showMe = "../images/infantry.png"
        } else if (classOfUnit === "catapult"){
            console.log("jestem??");
            showMe = "../images/catapult.png"
        } else if (classOfUnit === "engineer"){
            showMe = "../images/engineer.png"
        }
        return showMe
    };
    render(){
        let theGameBegin = () => {
            let boxCharacter = "";
            let randomNumber = Math.floor(Math.random()*100);

            if (randomNumber <= 7){
                boxCharacter = "hills"
            }
            else if (randomNumber <= 15 && randomNumber > 7) {
                boxCharacter = "forest"
            }
            else if (randomNumber <= 75 && randomNumber > 15 ) {
                boxCharacter ="normal"
            }
            else if (randomNumber <=85 && randomNumber > 75) {
                boxCharacter = "lake"
            }
            else {
                boxCharacter = "mountains"
            }
            return boxCharacter
        };
        return (
            <div>
            {this.grid.map((rowId) => {
                return <div className="grid" key={rowId} data-rowid={rowId}>
                    {this.grid.map((cellId) => (
                        <Cell key={cellId}
                              data-cellID = {cellId}
                              widthPercentage={this.cellWidthPercentage}
                              terrain = {theGameBegin()}
                              dropUnit = {this.handlerDropUnitOnBoard}
                              turnHandler = {this.handleTurnBasedGameplay}
                              gridSize = {this.props.gridSize}
                              handleSingleMove = {this.handleSingleMoveInTurn()}
                        />
                    ))}
                </div>
            })}
            </div>
        )
    }
}

class Units extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            chosenUnit: "",
            removed: false,
            madeMove: false,
            player: 1
        }
    }
    unitsBox1 = {
        width: 350,
        height: 50,
        display: "flex"
    };
    unitsBox2 = {
        width: 350,
        height: 50,
        display: "flex",
        borderColor: 'red'
    };
    unitBox1 = {
        width: 50,
        height: 50,
        boxSizing: "border-box",
        border: '1px solid black'
    };
    unitBox2 = {
        width: 50,
        height: 50,
        boxSizing: "border-box",
        border: "1px solid red"
    };
    units1 = ['cavalry', 'infantry', 'spearmen', 'catapult', 'crossbowman', 'archer', 'engineer'];
    units2 = ['cavalry', 'infantry', 'spearmen', 'catapult', 'crossbowman', 'archer', 'engineer'];

    selectedAndDrop = 0;

    removeFromUnits1 =() => {
        this.units1.splice(this.props.thisOne(), 1);
        this.setState({
            removed: true
        })
    };
    removeFromUnits2 =() => {
        this.units2.splice(this.props.thisOne(), 1);
        this.setState({
            removed: true
        })
    };

    handleClicker1 = (e) => {
        if (this.state.selected) {
            console.log("wybrałeś już jednostkę")
        }else if (!this.state.selected && this.state.player === 1) {
            e.target.classList.add("chosenUnit");
                this.setState({
                    selected: true,
                    chosenUnit: e.target
                });
            this.props.clickAction(e.target);
            this.selectedAndDrop = this.props.clickAction(e.target);
            console.log(this.selectedAndDrop);
            this.removeFromUnits1();
        }
        else {
            console.log("NIE")
        }
    };
    handleClicker2 = (e) => {
        if (this.state.selected) {
            console.log("wybrałeś już jednostkę")
        } else if (!this.state.selected && this.state.player === 2) {
            e.target.classList.add("chosenUnit");
            this.setState({
                selected: true,
                chosenUnit: e.target
            });
            this.props.clickAction(e.target);
            this.selectedAndDrop = this.props.clickAction(e.target);
            this.removeFromUnits2();
        } else{
            console.log("NIE")
        }
    };


    handlePlayerChange = () => {
        if (this.state.madeMove === false && this.state.player === 1){
            this.setState(
                {
                    player: 2,
                    selected: false
                },
                () => {
                    console.log("jesteeem")
                }
            );
            console.log(this.state.madeMove);
            console.log(this.state.player);
            return this.madeMove = true
        }
        else if (this.state.madeMove === false && this.state.player === 2) {
            this.setState({
                    player: 1,
                    selected: false
                },
                () => {
                    console.log("jesteeeeem2")
                }
            );
            console.log(this.madeMove);
            console.log(this.state.player);
            return this.madeMove = true
        }

    };

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>Gracz: {this.state.player}</div>
                <div style={this.unitsBox1} value={0}>
                    {this.units1.map((e, i) => {
                        return <div id={i} user = {1} key={i} className={e} style={this.unitBox1} onClick={this.handleClicker1}></div>
                    })
                    }
                </div>
                <div style={this.unitsBox2} value={0}>
                    {this.units2.map((e, i) => {
                        return <div id={i} user = {2} key={i} className={e} style={this.unitBox2} onClick={this.handleClicker2}></div>
                    })
                    }
                </div>
                <button onClick={this.handlePlayerChange}>Koniec tury</button>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boxCharacter: "",
        }
    }
    handlerUnitSet;
    selectedUnitId;
    selectedUnitAddClass = ""; // class of Adding Unit
    handleSendingClass = () => {
        this.selectedUnitAddClass = this.handlerUnitSet.classList[0];
        return this.selectedUnitAddClass
    };
    handleAddingUnits = (data) =>{
        this.handlerUnitSet = data;
        this.selectedUnitAddClass = this.handlerUnitSet.classList[0];
        this.selectedUnitId = this.handlerUnitSet.id;
        console.log(this.selectedUnitAddClass);
        return this.selectedUnitId
    };
    handleSendingRemoveID = () => {
        return this.selectedUnitId
    };

    render() {
        return (
            <div className="game container">
                <Board gridSize = {this.props.gridSize} selectedUnit = {this.handleSendingClass}/>
                <div className="message">To też</div>
                <Units clickAction={this.handleAddingUnits} thisOne={this.handleSendingRemoveID}/>
            </div>
        );
    }
}

ReactDOM.render(
    <Game gridSize={Number(prompt("Podaj rozmiar pola"))} />,
    document.getElementById('app')
);