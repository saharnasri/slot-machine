<template>
    <div class="d-flex justify-center">
        <div class="userProfile d-flex justify-space-around align-center">
            <div>
                <span>wallet: </span>
                <span> {{ wallet }} </span>
            </div>
            <div>
                <span>Your Credit: </span>
                <span> {{ credit }} </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useSlotMachineStore } from '../stores/slotMachine';
import { storeToRefs } from 'pinia';

const slotMachineStore = useSlotMachineStore();
const { credit, wallet } = storeToRefs(slotMachineStore);

</script>

<style>
@import url(@/assets/style/component/userProfile.css);
</style>