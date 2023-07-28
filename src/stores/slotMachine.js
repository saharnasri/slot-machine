import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSlotMachineStore = defineStore('slotMachine', () => {
  const credit = ref(10)
  const wallet = ref(0)
  const isGameOver = ref(false)
  const symbols = ref([
    {
      id: 1,
      name: 'cherry',
      reward: 10
    },
    {
      id: 2,
      name: 'lemon',
      reward: 20
    },
    {
      id: 3,
      name: 'orange',
      reward: 30
    },
    {
      id: 4,
      name: 'watermelon',
      reward: 40
    }
  ])
  function decrementCredit() {
    if (credit.value > 1) {
      credit.value--;
    } else if(credit.value === 1) {
        credit.value--;
        gameOver();

    } else {
      gameOver();
    }
  }
  function addReward(reward) {
    credit.value = credit.value + reward
  }
  function cashOut() {
    if (credit.value > 10) {
      wallet.value = wallet.value + credit.value - 10
      credit.value = 10
    }
  }
  function gameOver() {
    isGameOver.value = true
  }
  function reStart() {
    credit.value = 10;
    wallet.value = 0;
    isGameOver.value = false;

  }

  return {
    credit,
    wallet,
    symbols,
    isGameOver,
    decrementCredit,
    addReward,
    cashOut,
    reStart
  }
})
