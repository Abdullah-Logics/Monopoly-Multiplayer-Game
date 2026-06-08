import { useState, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import Board from './components/Board';
import PlayerPanel from './components/PlayerPanel';
import GameControls from './components/GameControls';
import InfoPanel from './components/InfoPanel';
import PropertyModal from './components/modals/PropertyModal';
import TradeModal from './components/modals/TradeModal';
import CardModal from './components/modals/CardModal';
import AuctionModal from './components/modals/AuctionModal';
import GameOverModal from './components/modals/GameOverModal';
import {
  PROPERTIES,
  CHANCE_CARDS,
  CHEST_CARDS,
  PLAYER_COLORS,
  PLAYER_TOKENS,
} from './gameData';
import { Player, GameProperty, GameRules, AuctionData } from './types';

export default function App() {
  // Setup state
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [rules, setRules] = useState<GameRules>({
    freeParking: false,
    doubleGo: false,
    noAuction: false,
    speedDie: false,
  });
  const [startingMoney, setStartingMoney] = useState(1500);

  // Game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [properties, setProperties] = useState<Record<number, GameProperty>>({});
  const [freeParking, setFreeParking] = useState(0);
  const [diceRolled, setDiceRolled] = useState(false);
  const [doublesCount, setDoublesCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [dice, setDice] = useState<[number, number]>([0, 0]);
  const [speedDieValue, setSpeedDieValue] = useState('⚡');
  const [isRolling, setIsRolling] = useState(false);

  // Modal state
  const [selectedProperty, setSelectedProperty] = useState<GameProperty | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyToBuy, setPropertyToBuy] = useState<GameProperty | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardType, setCardType] = useState<'chance' | 'chest' | null>(null);
  const [cardText, setCardText] = useState('');
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const currentPlayer = players[currentPlayerIdx];

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [message, ...prev.slice(0, 99)]);
  }, []);

  const startGame = () => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      newPlayers.push({
        id: i,
        name: playerNames[i] || `Player ${i + 1}`,
        money: startingMoney,
        position: 0,
        properties: [],
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
        getOutOfJailCards: 0,
        color: PLAYER_COLORS[i],
        token: PLAYER_TOKENS[i],
      });
    }

    const newProperties: Record<number, GameProperty> = {};
    PROPERTIES.forEach((p) => {
      newProperties[p.id] = {
        ...p,
        owner: null,
        houses: 0,
        mortgaged: false,
      };
    });

    setPlayers(newPlayers);
    setProperties(newProperties);
    setGameStarted(true);
    addLog(`🎲 Game started with ${playerCount} players!`);
  };

  const movePlayer = useCallback(
    (playerIdx: number, spaces: number) => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const player = { ...newPlayers[playerIdx] };
        const oldPos = player.position;
        let newPos = (oldPos + spaces + 40) % 40;

        if (spaces > 0 && newPos < oldPos) {
          player.money += 200;
          addLog(`🏁 ${player.name} passed GO and collected $200!`);
        }

        player.position = newPos;
        newPlayers[playerIdx] = player;
        return newPlayers;
      });
    },
    [addLog]
  );

  const moveToPosition = useCallback(
    (playerIdx: number, position: number) => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const player = { ...newPlayers[playerIdx] };
        const oldPos = player.position;

        if (position !== 10 && position < oldPos) {
          player.money += 200;
          addLog(`🏁 ${player.name} passed GO and collected $200!`);
        }

        if (position === 0 && rules.doubleGo) {
          player.money += 200;
          addLog(`🎯 ${player.name} landed exactly on GO! Extra $200!`);
        }

        player.position = position;
        newPlayers[playerIdx] = player;
        return newPlayers;
      });
    },
    [addLog, rules.doubleGo]
  );

  const sendToJail = useCallback(
    (playerIdx: number) => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const player = { ...newPlayers[playerIdx] };
        player.position = 10;
        player.inJail = true;
        player.jailTurns = 0;
        newPlayers[playerIdx] = player;
        return newPlayers;
      });
      addLog(`🔒 ${players[playerIdx]?.name || 'Player'} was sent to Jail!`);
    },
    [addLog, players]
  );

  const calculateRent = useCallback(
    (prop: GameProperty, diceTotal: number): number => {
      if (prop.mortgaged || prop.owner === null) return 0;

      const owner = players[prop.owner];

      if (prop.type === 'railroad') {
        const railroads = owner.properties.filter(
          (pId) => properties[pId].group === 'railroad'
        ).length;
        return [25, 50, 100, 200][railroads - 1];
      }

      if (prop.type === 'utility') {
        const utilities = owner.properties.filter(
          (pId) => properties[pId].group === 'utility'
        ).length;
        return utilities === 2 ? diceTotal * 10 : diceTotal * 4;
      }

      if (!prop.rent) return 0;

      let rent = prop.rent[prop.houses];

      if (prop.houses === 0) {
        const group = prop.group;
        const groupProps = Object.values(properties).filter((p) => p.group === group);
        const ownsAll = groupProps.every((p) => p.owner === prop.owner);
        if (ownsAll) rent *= 2;
      }

      return rent;
    },
    [players, properties]
  );

  const handleLanding = useCallback(
    (playerIdx: number, diceTotal: number) => {
      const player = players[playerIdx];
      const prop = properties[player.position];

      addLog(`📍 ${player.name} landed on ${prop.name}`);

      switch (prop.type) {
        case 'property':
        case 'railroad':
        case 'utility':
          if (prop.owner === null) {
            setPropertyToBuy(prop);
            setShowPropertyModal(true);
          } else if (prop.owner !== playerIdx && !prop.mortgaged) {
            const rent = calculateRent(prop, diceTotal);
            const owner = players[prop.owner];

            setPlayers((prev) => {
              const newPlayers = [...prev];
              newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money - rent };
              newPlayers[prop.owner!] = { ...newPlayers[prop.owner!], money: newPlayers[prop.owner!].money + rent };
              return newPlayers;
            });

            addLog(`💰 ${player.name} paid $${rent} rent to ${owner.name}`);
          }
          break;

        case 'tax':
          setPlayers((prev) => {
            const newPlayers = [...prev];
            newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money - (prop.amount || 0) };
            return newPlayers;
          });
          addLog(`💸 ${player.name} paid $${prop.amount} tax`);
          if (rules.freeParking) {
            setFreeParking((prev) => prev + (prop.amount || 0));
          }
          break;

        case 'chance':
          drawCard(playerIdx, 'chance', diceTotal);
          break;

        case 'chest':
          drawCard(playerIdx, 'chest', diceTotal);
          break;

        case 'corner':
          if (prop.id === 30) {
            sendToJail(playerIdx);
          } else if (prop.id === 20 && rules.freeParking && freeParking > 0) {
            setPlayers((prev) => {
              const newPlayers = [...prev];
              newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money + freeParking };
              return newPlayers;
            });
            addLog(`🅿️ ${player.name} collected $${freeParking} from Free Parking!`);
            setFreeParking(0);
          }
          break;
      }
    },
    [players, properties, addLog, calculateRent, rules.freeParking, freeParking, sendToJail]
  );

  const drawCard = (playerIdx: number, type: 'chance' | 'chest', diceTotal: number) => {
    const cards = type === 'chance' ? CHANCE_CARDS : CHEST_CARDS;
    const card = cards[Math.floor(Math.random() * cards.length)];

    setCardType(type);
    setCardText(card.text);
    setShowCardModal(true);

    setTimeout(() => {
      executeCardAction(playerIdx, card, diceTotal);
    }, 500);
  };

  const executeCardAction = (playerIdx: number, card: { action: string; value?: number; position?: number }, diceTotal: number) => {
    const player = players[playerIdx];

    switch (card.action) {
      case 'moveToGo':
        moveToPosition(playerIdx, 0);
        setPlayers((prev) => {
          const newPlayers = [...prev];
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money + 200 };
          return newPlayers;
        });
        break;

      case 'moveTo':
        if (card.position !== undefined) {
          moveToPosition(playerIdx, card.position);
          setTimeout(() => handleLanding(playerIdx, diceTotal), 600);
        }
        break;

      case 'collect':
        setPlayers((prev) => {
          const newPlayers = [...prev];
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money + (card.value || 0) };
          return newPlayers;
        });
        break;

      case 'pay':
        setPlayers((prev) => {
          const newPlayers = [...prev];
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money - (card.value || 0) };
          return newPlayers;
        });
        if (rules.freeParking) {
          setFreeParking((prev) => prev + (card.value || 0));
        }
        break;

      case 'jailCard':
        setPlayers((prev) => {
          const newPlayers = [...prev];
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], getOutOfJailCards: newPlayers[playerIdx].getOutOfJailCards + 1 };
          return newPlayers;
        });
        break;

      case 'goToJail':
        sendToJail(playerIdx);
        break;

      case 'moveBack':
        movePlayer(playerIdx, -(card.value || 0));
        setTimeout(() => handleLanding(playerIdx, diceTotal), 600);
        break;

      case 'repairs':
        const repairCost = player.properties.reduce((sum, pId) => {
          const p = properties[pId];
          if (p.houses === 5) return sum + 100;
          return sum + p.houses * 25;
        }, 0);
        setPlayers((prev) => {
          const newPlayers = [...prev];
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money - repairCost };
          return newPlayers;
        });
        addLog(`🔧 ${player.name} paid $${repairCost} for repairs.`);
        break;

      case 'payEach':
        setPlayers((prev) => {
          const newPlayers = [...prev];
          const activePlayers = newPlayers.filter((p) => !p.bankrupt && p.id !== playerIdx);
          const totalPay = activePlayers.length * (card.value || 0);
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money - totalPay };
          activePlayers.forEach((p) => {
            newPlayers[p.id] = { ...newPlayers[p.id], money: newPlayers[p.id].money + (card.value || 0) };
          });
          return newPlayers;
        });
        break;

      case 'collectFromAll':
        setPlayers((prev) => {
          const newPlayers = [...prev];
          const activePlayers = newPlayers.filter((p) => !p.bankrupt && p.id !== playerIdx);
          let totalCollect = 0;
          activePlayers.forEach((p) => {
            newPlayers[p.id] = { ...newPlayers[p.id], money: newPlayers[p.id].money - (card.value || 0) };
            totalCollect += card.value || 0;
          });
          newPlayers[playerIdx] = { ...newPlayers[playerIdx], money: newPlayers[playerIdx].money + totalCollect };
          return newPlayers;
        });
        break;
    }
  };

  const rollDice = () => {
    if (diceRolled && doublesCount === 0) return;
    if (currentPlayer?.bankrupt) {
      endTurn();
      return;
    }

    setIsRolling(true);

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDice([d1, d2]);

      const isDoubles = d1 === d2;
      let total = d1 + d2;

      if (rules.speedDie) {
        const speedRoll = Math.floor(Math.random() * 6);
        const speedValues = ['1', '2', '3', '🚌', '🚌', '👔'];
        setSpeedDieValue(speedValues[speedRoll]);
        if (speedRoll < 3) {
          total += speedRoll + 1;
        }
      }

      addLog(`🎲 ${currentPlayer.name} rolled ${d1} + ${d2} = ${total}${isDoubles ? ' (DOUBLES!)' : ''}`);

      setIsRolling(false);

      if (currentPlayer.inJail) {
        handleJailRoll(d1, d2, isDoubles, total);
        return;
      }

      if (isDoubles) {
        if (doublesCount + 1 >= 3) {
          addLog(`👮 ${currentPlayer.name} rolled 3 doubles! Going to jail!`);
          sendToJail(currentPlayerIdx);
          setDiceRolled(true);
          setDoublesCount(0);
          return;
        }
        setDoublesCount((prev) => prev + 1);
      } else {
        setDoublesCount(0);
      }

      setDiceRolled(true);
      movePlayer(currentPlayerIdx, total);

      setTimeout(() => {
        handleLanding(currentPlayerIdx, total);
      }, 600);
    }, 600);
  };

  const handleJailRoll = (_d1: number, _d2: number, isDoubles: boolean, total: number) => {
    setPlayers((prev) => {
      const newPlayers = [...prev];
      const player = { ...newPlayers[currentPlayerIdx] };
      player.jailTurns++;

      if (isDoubles) {
        player.inJail = false;
        addLog(`🎉 ${player.name} rolled doubles and is free from jail!`);
        newPlayers[currentPlayerIdx] = player;
        setDiceRolled(true);
        setTimeout(() => {
          movePlayer(currentPlayerIdx, total);
          setTimeout(() => handleLanding(currentPlayerIdx, total), 600);
        }, 100);
      } else if (player.jailTurns >= 3) {
        player.inJail = false;
        player.money -= 50;
        addLog(`💵 ${player.name} paid $50 after 3 turns and left jail.`);
        newPlayers[currentPlayerIdx] = player;
        setDiceRolled(true);
        setTimeout(() => {
          movePlayer(currentPlayerIdx, total);
          setTimeout(() => handleLanding(currentPlayerIdx, total), 600);
        }, 100);
      } else {
        addLog(`😢 ${player.name} failed to roll doubles. Still in jail.`);
        newPlayers[currentPlayerIdx] = player;
        setDiceRolled(true);
      }

      return newPlayers;
    });
  };

  const useJailCard = () => {
    if (currentPlayer.getOutOfJailCards > 0) {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[currentPlayerIdx] = {
          ...newPlayers[currentPlayerIdx],
          getOutOfJailCards: newPlayers[currentPlayerIdx].getOutOfJailCards - 1,
          inJail: false,
        };
        return newPlayers;
      });
      addLog(`🎫 ${currentPlayer.name} used a Get Out of Jail Free card!`);
    }
  };

  const payJailFine = () => {
    if (currentPlayer.money >= 50) {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[currentPlayerIdx] = {
          ...newPlayers[currentPlayerIdx],
          money: newPlayers[currentPlayerIdx].money - 50,
          inJail: false,
        };
        return newPlayers;
      });
      addLog(`💵 ${currentPlayer.name} paid $50 to leave jail.`);
    }
  };

  const buyProperty = () => {
    if (!propertyToBuy) return;

    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[currentPlayerIdx] = {
        ...newPlayers[currentPlayerIdx],
        money: newPlayers[currentPlayerIdx].money - (propertyToBuy.price || 0),
        properties: [...newPlayers[currentPlayerIdx].properties, propertyToBuy.id],
      };
      return newPlayers;
    });

    setProperties((prev) => ({
      ...prev,
      [propertyToBuy.id]: { ...prev[propertyToBuy.id], owner: currentPlayerIdx },
    }));

    addLog(`🏠 ${currentPlayer.name} bought ${propertyToBuy.name} for $${propertyToBuy.price}`);
    setShowPropertyModal(false);
    setPropertyToBuy(null);
  };

  const declinePurchase = () => {
    setShowPropertyModal(false);

    if (!rules.noAuction && propertyToBuy) {
      startAuction(propertyToBuy.id);
    }
    setPropertyToBuy(null);
  };

  const startAuction = (propId: number) => {
    setAuctionData({
      propId,
      currentBid: 0,
      currentBidder: null,
      activePlayers: players.filter((p) => !p.bankrupt).map((p) => p.id),
      currentIdx: 0,
    });
    setShowAuctionModal(true);
  };

  const placeBid = (amount: number) => {
    if (!auctionData) return;

    const currentBidderIdx = auctionData.activePlayers[auctionData.currentIdx];
    const player = players[currentBidderIdx];

    if (amount > auctionData.currentBid && amount <= player.money) {
      addLog(`🔨 ${player.name} bid $${amount} on ${properties[auctionData.propId].name}`);

      setAuctionData((prev) => {
        if (!prev) return null;
        const nextIdx = (prev.currentIdx + 1) % prev.activePlayers.length;

        if (prev.activePlayers[nextIdx] === currentBidderIdx) {
          endAuction({ ...prev, currentBid: amount, currentBidder: currentBidderIdx });
          return null;
        }

        return {
          ...prev,
          currentBid: amount,
          currentBidder: currentBidderIdx,
          currentIdx: nextIdx,
        };
      });
    }
  };

  const passAuction = () => {
    if (!auctionData) return;

    const currentBidderIdx = auctionData.activePlayers[auctionData.currentIdx];
    const newActivePlayers = auctionData.activePlayers.filter((id) => id !== currentBidderIdx);

    if (newActivePlayers.length === 0 || (newActivePlayers.length === 1 && auctionData.currentBidder !== null)) {
      endAuction({ ...auctionData, activePlayers: newActivePlayers });
    } else {
      const newIdx = auctionData.currentIdx >= newActivePlayers.length ? 0 : auctionData.currentIdx;
      setAuctionData({
        ...auctionData,
        activePlayers: newActivePlayers,
        currentIdx: newIdx,
      });
    }
  };

  const endAuction = (data: AuctionData) => {
    const prop = properties[data.propId];

    setShowAuctionModal(false);
    setAuctionData(null);

    if (data.currentBidder !== null && data.currentBid > 0) {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[data.currentBidder!] = {
          ...newPlayers[data.currentBidder!],
          money: newPlayers[data.currentBidder!].money - data.currentBid,
          properties: [...newPlayers[data.currentBidder!].properties, data.propId],
        };
        return newPlayers;
      });

      setProperties((prev) => ({
        ...prev,
        [data.propId]: { ...prev[data.propId], owner: data.currentBidder },
      }));

      addLog(`🎉 ${players[data.currentBidder!].name} won auction for ${prop.name} at $${data.currentBid}!`);
    } else {
      addLog(`❌ No one bought ${prop.name} at auction.`);
    }
  };

  const canBuyHouse = (propId: number): boolean => {
    const prop = properties[propId];
    if (prop.type !== 'property') return false;
    if (prop.owner === null || prop.owner !== currentPlayerIdx) return false;
    if (prop.houses >= 5) return false;
    if (prop.mortgaged) return false;

    const player = players[prop.owner];
    if (player.money < (prop.houseCost || 0)) return false;

    const groupProps = Object.values(properties).filter((p) => p.group === prop.group);
    if (!groupProps.every((p) => p.owner === prop.owner)) return false;

    const minHouses = Math.min(...groupProps.map((p) => p.houses));
    if (prop.houses > minHouses) return false;

    return true;
  };

  const buyHouse = (propId: number) => {
    const prop = properties[propId];
    if (!canBuyHouse(propId)) return;

    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[prop.owner!] = {
        ...newPlayers[prop.owner!],
        money: newPlayers[prop.owner!].money - (prop.houseCost || 0),
      };
      return newPlayers;
    });

    setProperties((prev) => ({
      ...prev,
      [propId]: { ...prev[propId], houses: prev[propId].houses + 1 },
    }));

    addLog(`🏠 ${currentPlayer.name} bought a ${prop.houses + 1 === 5 ? 'hotel' : 'house'} on ${prop.name}`);
    setSelectedProperty({ ...prop, houses: prop.houses + 1 });
  };

  const sellHouse = (propId: number) => {
    const prop = properties[propId];
    if (prop.houses === 0) return;

    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[prop.owner!] = {
        ...newPlayers[prop.owner!],
        money: newPlayers[prop.owner!].money + Math.floor((prop.houseCost || 0) / 2),
      };
      return newPlayers;
    });

    setProperties((prev) => ({
      ...prev,
      [propId]: { ...prev[propId], houses: prev[propId].houses - 1 },
    }));

    addLog(`💵 ${currentPlayer.name} sold a house on ${prop.name}`);
    setSelectedProperty({ ...prop, houses: prop.houses - 1 });
  };

  const mortgageProperty = (propId: number) => {
    const prop = properties[propId];
    if (prop.houses > 0) return;

    setProperties((prev) => ({
      ...prev,
      [propId]: { ...prev[propId], mortgaged: true },
    }));

    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[prop.owner!] = {
        ...newPlayers[prop.owner!],
        money: newPlayers[prop.owner!].money + Math.floor((prop.price || 0) / 2),
      };
      return newPlayers;
    });

    addLog(`📜 ${currentPlayer.name} mortgaged ${prop.name}`);
    setSelectedProperty({ ...prop, mortgaged: true });
  };

  const unmortgageProperty = (propId: number) => {
    const prop = properties[propId];
    const cost = Math.floor((prop.price || 0) / 2);

    if (players[prop.owner!].money < cost) return;

    setProperties((prev) => ({
      ...prev,
      [propId]: { ...prev[propId], mortgaged: false },
    }));

    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[prop.owner!] = {
        ...newPlayers[prop.owner!],
        money: newPlayers[prop.owner!].money - cost,
      };
      return newPlayers;
    });

    addLog(`✅ ${currentPlayer.name} unmortgaged ${prop.name}`);
    setSelectedProperty({ ...prop, mortgaged: false });
  };

  const executeTrade = (
    partnerId: number,
    offerMoney: number,
    receiveMoney: number,
    offerProps: number[],
    receiveProps: number[]
  ) => {
    setPlayers((prev) => {
      const newPlayers = [...prev];

      newPlayers[currentPlayerIdx] = {
        ...newPlayers[currentPlayerIdx],
        money: newPlayers[currentPlayerIdx].money - offerMoney + receiveMoney,
        properties: newPlayers[currentPlayerIdx].properties
          .filter((id) => !offerProps.includes(id))
          .concat(receiveProps),
      };

      newPlayers[partnerId] = {
        ...newPlayers[partnerId],
        money: newPlayers[partnerId].money + offerMoney - receiveMoney,
        properties: newPlayers[partnerId].properties
          .filter((id) => !receiveProps.includes(id))
          .concat(offerProps),
      };

      return newPlayers;
    });

    setProperties((prev) => {
      const newProps = { ...prev };
      offerProps.forEach((pId) => {
        newProps[pId] = { ...newProps[pId], owner: partnerId };
      });
      receiveProps.forEach((pId) => {
        newProps[pId] = { ...newProps[pId], owner: currentPlayerIdx };
      });
      return newProps;
    });

    addLog(`🤝 ${currentPlayer.name} traded with ${players[partnerId].name}!`);
    setShowTradeModal(false);
  };

  const checkWinner = () => {
    const activePlayers = players.filter((p) => !p.bankrupt);
    if (activePlayers.length === 1) {
      setWinner(activePlayers[0]);
      setShowGameOver(true);
    }
  };

  const endTurn = () => {
    setDiceRolled(false);
    setDoublesCount(0);

    let nextPlayer = (currentPlayerIdx + 1) % players.length;
    while (players[nextPlayer].bankrupt) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }

    setCurrentPlayerIdx(nextPlayer);
    addLog(`--- ${players[nextPlayer].name}'s turn ---`);
    checkWinner();
  };

  const showEndTurn = diceRolled && doublesCount === 0 && !showPropertyModal && !showAuctionModal;

  if (!gameStarted) {
    return (
      <>
        <div className="stars" />
        <SetupScreen
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          rules={rules}
          setRules={setRules}
          startingMoney={startingMoney}
          setStartingMoney={setStartingMoney}
          onStartGame={startGame}
        />
      </>
    );
  }

  return (
    <>
      <div className="stars" />
      <div className="relative z-10 p-4">
        <div className="flex flex-wrap gap-4">
          <PlayerPanel
            players={players}
            currentPlayer={currentPlayerIdx}
            properties={properties}
          />

          <div className="flex-1 flex flex-col items-center">
            <Board
              properties={properties}
              players={players}
              freeParking={freeParking}
              onPropertyClick={(propId) => setSelectedProperty(properties[propId])}
            />

            <GameControls
              dice={dice}
              speedDieValue={speedDieValue}
              isRolling={isRolling}
              showSpeedDie={rules.speedDie}
              canRoll={!diceRolled || doublesCount > 0}
              showEndTurn={showEndTurn}
              onRollDice={rollDice}
              onEndTurn={endTurn}
              onOpenTrade={() => setShowTradeModal(true)}
            />
          </div>

          {currentPlayer && (
            <InfoPanel
              currentPlayer={currentPlayer}
              selectedProperty={selectedProperty}
              logs={logs}
              players={players}
              onUseJailCard={useJailCard}
              onPayJailFine={payJailFine}
              onBuyHouse={buyHouse}
              onSellHouse={sellHouse}
              onMortgage={mortgageProperty}
              onUnmortgage={unmortgageProperty}
              canBuyHouse={canBuyHouse}
            />
          )}
        </div>
      </div>

      <PropertyModal
        isOpen={showPropertyModal}
        property={propertyToBuy}
        player={currentPlayer}
        noAuction={rules.noAuction}
        onBuy={buyProperty}
        onDecline={declinePurchase}
        onClose={() => setShowPropertyModal(false)}
      />

      <TradeModal
        isOpen={showTradeModal}
        currentPlayer={currentPlayer}
        players={players}
        properties={properties}
        onExecuteTrade={executeTrade}
        onClose={() => setShowTradeModal(false)}
      />

      <CardModal
        isOpen={showCardModal}
        cardType={cardType}
        cardText={cardText}
        onClose={() => setShowCardModal(false)}
      />

      <AuctionModal
        isOpen={showAuctionModal}
        auctionData={auctionData}
        property={auctionData ? properties[auctionData.propId] : null}
        players={players}
        onPlaceBid={placeBid}
        onPass={passAuction}
      />

      <GameOverModal isOpen={showGameOver} winner={winner} properties={properties} />
    </>
  );
}
