# Retrieving A Slot Value

When building a skill, you will often need to retrieve the value your user indicated as a slot.  You can check `this.event.request.intent.slots.SLOTNAME.value` in each case, but this doesn't offer you the safety of validating that the slot actually exists before your request.

From your intent, you can call `getSlotValue(slotname)`, and it will return the value of the slot if it exists.

    var slotValue = getSlotValue.call(this, "activities");

You can add the the following helper function, `getSlotValue(slotName)` into your code to provide a safe, easy way to retrieve your slot values.

    function getSlotValue(slotName)
    {
        if (this.event.request.intent && this.event.request.intent.slots && this.event.request.slots[slotName] && this.event.request.intent.slots[slotName].value) return this.event.request.intent.slots[slotName].value;
        else return "";
    }
