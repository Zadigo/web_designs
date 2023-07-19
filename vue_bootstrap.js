
const BaseCheckBox = {
    name: 'BaseCheckbox',
    props: {
        id: {
            type: String,
            required: true
        },
        // bigger: {
        //   type: Boolean
        // },
        inline: {
            type: Boolean
        },
        isSwitch: {
            type: Boolean,
            default: false
        },
        isRadio: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: Boolean
        },
        label: {
            type: String,
            required: true
        },
        name: {
            type: String
        }
    },
    template: `
    <div :class="[isSwitch ? 'form-switch' : 'form-check', {'form-check-inline': inline }]">
        <input :id="id" :class="inputClasses" :checked="modelValue" :type="checkboxType" :role="[isSwitch ? 'switch' : null]" :name="name" class="form-check-input" @change="emitValue($event)">
        <label :for="id" class="form-check-label">[[ label ]]</label>
    </div >
    `,
    emits: {
        'update:modelValue'() {
            return true
        }
    },
    setup() {
        const darkMode = inject('darkMode', () => false)
        return {
            darkMode
        }
    },
    computed: {
        inputClasses() {
            return [
                // {
                //   'fs-input-bigger': this.bigger && !this.isSwitch,
                // },
                {
                    dark: this.darkMode
                }
            ]
        },
        checkboxType() {
            if (this.isSwitch && this.isRadio) {
                return 'checkbox'
            } else if (this.isSwitch) {
                return 'checkbox'
            } else if (this.isRadio) {
                return 'radio'
            } else {
                return 'checkbox'
            }
        }
    },
    methods: {
        emitValue(e) {
            // https://stackoverflow.com/questions/70515367/passing-v-model-into-a-checkbox-inside-a-component-in-vue-3
            this.$emit('update:modelValue', e.target.checked)
        }
    }
}


const BaseInput = {
    name: 'BaseInput',
    template: `
        <input :id="id" :value="modelValue" :type="inputType" :name="id" :class="inputClasses" class="form-control" @input="emitValue($event)">
    `,
    props: {
        id: {
            type: String,
            required: true
        },
        inputType: {
            type: String,
            default: 'text'
        },
        modelValue: {
            type: [String, Number, Boolean]
        }
    },
    emits: {
        'update:modelValue'() {
            return true
        }
    },
    setup() {
        const darkMode = inject('darkMode', false)
        return {
            darkMode
        }
    },
    computed: {
        inputClasses() {
            return [
                {
                    'bg-transparent text-light': this.darkMode
                }
            ]
        }
    },
    methods: {
        emitValue(e) {
            let value = e.target.value
            if (this.inputType === 'number') {
                value = value * 1
            }
            this.$emit('update:modelValue', value)
        }
    }
}

const BasePagination = {
    name: 'BasePagination',
    props: {
        pages: {
            type: Number,
            default: 1
        },
        circle: {
            type: Boolean
        },
        centered: {
            type: Boolean
        },
        syncCurrentPage: {
            type: Number,
            default: null
        }
    },
    template: `
    <nav :class="{'pagination-dark': darkMode}" aria-label="Page navigation example">
        <ul :class="paginationClasses" class="pagination">
        <li :class="[selected === 1 ? 'disabled' : null]" class="page-item">
            <a class="page-link" href @click.prevent="substract">
            Previous
            </a>
        </li>
        
        <li v-for="page in pages" :key="page" :class="[selected === page ? 'active' : null]" class="page-item">
            <a class="page-link" href @click.prevent="selected = page, $emit('page-click', page)">
                [[ page ]]
            </a>
        </li>

        <li :class="[selected === pages ? 'disabled' : null]" class="page-item">
            <a class="page-link" href @click.prevent="add">
            Next
            </a>
        </li>
        </ul>
    </nav>
    `,
    emits: {
        'page-click'() {
            return true
        }
    },
    setup() {
        const darkMode = inject('darkMode', false)
        return {
            darkMode
        }
    },
    data() {
        return {
            selected: 1
        }
    },
    computed: {
        paginationClasses() {
            return [
                // pagination-md 
                this.circle ? 'pagination-circle' : null,
                this.centered ? 'justify-content-center' : null,
            ]
        }
    },
    watch: {
        syncCurrentPage() {
            // FIXME: Allows multiple BasePagination components
            // to sync together via a central parameter
            // that references the current page
            if (this.syncCurrentPage !== null) {
                if (this.selected !== this.syncCurrentPage) {
                    this.selected = this.syncCurrentPage
                }
            }
        }
    },
    methods: {
        add() {
            const result = this.selected + 1 > this.pages ? 1 : this.selected + 1
            this.selected = result
            this.$emit('page-click', result)
        },
        substract() {
            const result = this.selected - 1 <= 0 ? this.pages : this.selected - 1
            this.selected = result
            this.$emit('page-click', result)
        }
    }
}

app.component('BaseCheckbox', BaseCheckBox)
app.component('BaseInput', BaseInput)
app.component('BasePagination', BasePagination)
