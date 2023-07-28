<template>
    <div>
        <!-- slots  -->
        <div class="slotBox d-flex justify-space-around align-center">
            <div class="slot">
                <span v-if="slotLoading.first">
                    <SpinnerIcon />
                </span>
                <img :src="`images/${firstSlot}.svg`" alt="slot icon" width="100" v-else>
            </div>
            <div class="slot">
                <span v-if="slotLoading.second">
                    <SpinnerIcon />
                </span>
                <img :src="`images/${secondSlot}.svg`" alt="slot icon" width="100" v-else>
            </div>
            <div class="slot">
                <span v-if="slotLoading.third">
                    <SpinnerIcon />
                </span>
                <img :src="`images/${thirdSlot}.svg`" alt="slot icon" width="100" v-else>
            </div>
        </div>


        <!-- start button  -->
        <div class="d-flex justify-center">
            <button :disabled="slotLoading.third" :class="isGameOver ? 'gameOverButton' : 'startButton'" class="button"
                @click="startGame">
                <span> {{ btnText }}</span>
            </button>
        </div>

        <!-- cash out button  -->
        <div class="d-flex justify-center">
            <button class="cashOutButton" @click="cashOut">
                <span>Cash Out</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import SpinnerIcon from './icons/IconSpinner.vue';
import { useSlotMachineStore } from '../stores/slotMachine';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const slotMachineStore = useSlotMachineStore();
const { isGameOver, symbols, credit } = storeToRefs(slotMachineStore);
const { decrementCredit, addReward, cashOut, reStart } = slotMachineStore;

const firstSlot = ref('cherry');
const secondSlot = ref('orange');
const thirdSlot = ref('lemon');

const slotLoading = ref({
    first: false,
    second: false,
    third: false
})

const btnText = computed(() => {
    return isGameOver.value ? 'Game Over' : 'Start'
})

const startGame = () => {
    if (!isGameOver.value) {
        setLoading('first', true);
        setLoading('second', true);
        setLoading('third', true);

        const randomNums = setRandomNumber();
        checkWinAndReward(randomNums);
    } else {
        reStart();
    }
}

// set loading status 
const setLoading = (slot, value) => {
    slotLoading.value[slot] = value;
};

// compare the values of random Numbers to calulate the reward 
const checkWinAndReward = (randomNums) => {
    const useRandomNumbers = ref(randomNums);
    const compareResult = ref(compareValues(randomNums));
    if (compareResult.value && credit.value > 40) {
        const useCheatResult = useCheat(randomNums, compareResult.value);
        useRandomNumbers.value = useCheatResult.numbers;
        compareResult.value = useCheatResult.compare;
    }
    // set slots values 
    setSlotValues(useRandomNumbers.value);

    // set  new credit
    if (compareResult.value) {
        timeoutResolver(3000).then(() => {
            addReward(symbols.value[useRandomNumbers.value.first].reward);
        });
    } else {
        timeoutResolver(3000).then(() => {
            decrementCredit();
        });
    }
};
const useCheat = (randomNums, compareResult) => {
    if (credit.value <= 60) {
        if (Math.random() < 0.3) {
            const reRollResult = setRandomNumber();
            return { numbers: reRollResult, compare: compareValues(reRollResult) };
        }
        return { numbers: randomNums, compare: compareResult };
    } else {
        if (Math.random() < 0.6) {
            const reRollResult2 = setRandomNumber();
            return { numbers: reRollResult2, compare: compareValues(reRollResult2) };
        }
        return { numbers: randomNums, compare: compareResult };
    }
}
const compareValues = (value) => (value.first == value.second) && (value.second == value.third);

// select random numbers 
const setRandomNumber = () => {
    const randomNumbers = {
        first: randomNumber(),
        second: randomNumber(),
        third: randomNumber()
    }
    return randomNumbers;
};

// set slot images base on random numbers with delays
const setSlotValues = (randomNums) => {
    timeoutResolver(1000).then(() => {
        firstSlot.value = symbols.value[randomNums.first].name;
        setLoading('first', false);
        timeoutResolver(1000).then(() => {
            secondSlot.value = symbols.value[randomNums.second].name;
            setLoading('second', false);
            timeoutResolver(1000).then(() => {
                thirdSlot.value = symbols.value[randomNums.third].name;
                setLoading('third', false);
            })
        })
    });
};

// select random number 
const randomNumber = () => {
    return Math.floor(Math.random() * 4);
};

// timeout function for simulating delay 
function timeoutResolver(ms) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(true);
        }, ms);
    });
}
</script>

<style>
@import url(@/assets/style/component/slotMachine.css);
</style>