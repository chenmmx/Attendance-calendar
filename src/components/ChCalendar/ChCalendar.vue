<template>
  <div id="ch-calendar">
    <div class="ch-calendar-title">
      <span style="margin-right: 30px;">{{data.personName}}</span><span>{{data.personGroup}}</span>
    </div>
    <div class="ch-calendar-main">
      <div class="calendar">
        <h2 class="calendar-title">
          <span
            class="calendar-btn el-icon-caret-left"
            @click="onPreClick"
          ></span
          >{{ selectedYear }}年{{ selectedMonth }}月<span
            class="calendar-btn el-icon-caret-right"
            @click="onNextClick"
          ></span>
        </h2>
        <div class="calendar-main">
          <!-- 周一至周日展示头 -->
          <div class="calendar-main-head">
            <div
              class="calendar-main-head--item"
              v-for="(item, index) of calendarHeader"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <!-- 日期渲染列表 -->
          <div class="calendar-main-block">
            <div
              class="calendar-main-block--pre"
              v-for="item of preDate"
              :key="item + new Date().getTime()"
            >
              {{ item }}
            </div>
            <div
              :class="`calendar-main-block--item ${(normalArray.indexOf(item) === -1) ? '' : 'normal'} ${(abnormalArray.indexOf(item) === -1) ? '' : 'abnormal'} ${isSelect === item ? 'select' : ''} ${new Date().getDate() === item && new Date().getMonth() === selectedMonth - 1 ? 'today' : ''}`"
              v-for="(item, index) of mainDate"
              :key="index"
              @click="onDateClick(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="ch-calendar-main-right">
        <div class="ch-calendar-main-right-top">
          <div class="ch-calendar-main-right-top--img">
            <img :src="data.amImg" alt="" />
          </div>
          <div
            class="ch-calendar-main-right-top--content"
            style="padding-top:20px;text-align:center;width:90px;"
          >
            <p>{{ data.amTime }}</p>
            <p>{{ data.amState }}</p>
          </div>
        </div>
        <div class="ch-calendar-main-right-bottom">
          <div class="ch-calendar-main-right-bottom--img">
            <img :src="data.pmImg" alt="" />
          </div>
          <div
            class="ch-calendar-main-right-bottom--content"
            style="padding-top:20px;text-align:center;width:90px;"
          >
            <p>{{ data.pmTime }}</p>
            <p>{{ data.pmState }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChCalendar',
  mounted () {
    this.init()
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    abnormalArray: {
      type: Array,
      required: true
    },
    normalArray: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      calendarHeader: ['一', '二', '三', '四', '五', '六', '日'],
      // 月份灰色字段
      preDate: [],
      mainDate: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth:
        parseInt(new Date().getMonth()) + 1 < 10
          ? '0' + (parseInt(new Date().getMonth()) + 1)
          : parseInt(new Date().getMonth()) + 1,
      isSelect: ''
    }
  },
  methods: {
    init (
      year = new Date().getFullYear(),
      month = parseInt(new Date().getMonth()) + 1
    ) {
      month = month - 1
      let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
      }
      // 获得指定年月的1号是星期几
      let targetDay = new Date(year, month, 1).getDay()
      if (targetDay === 0) {
        targetDay = 7
      }
      let preArr = []
      for (let i = 0; i < targetDay - 1; i++) {
        let idx = parseInt(month) - 1
        if (idx === -1) {
          idx = 11
        }
        let perMonth = daysInMonth[idx] - i
        preArr.unshift(perMonth)
      }
      // 当前月展示上个月灰色部分
      this.preDate = preArr
      let mainArr = []
      for (let i = 0; i < daysInMonth[month]; i++) {
        mainArr.push(i + 1)
      }
      // 本月数据
      this.mainDate = mainArr
    },
    // 前一月
    onPreClick () {
      this.isSelect = ''
      this.selectedMonth =
        parseInt(this.selectedMonth) - 1 < 10
          ? '0' + (parseInt(this.selectedMonth) - 1)
          : parseInt(this.selectedMonth) - 1
      if (this.selectedMonth === '00') {
        this.selectedMonth = 12
        this.selectedYear = this.selectedYear - 1
      }
      this.init(this.selectedYear, parseInt(this.selectedMonth))
      let nowDate = `${this.selectedYear}-${this.selectedMonth}`
      this.$emit('monthChange', nowDate)
    },
    // 后一月
    onNextClick () {
      this.isSelect = ''
      this.selectedMonth =
        parseInt(this.selectedMonth) + 1 < 10
          ? '0' + (parseInt(this.selectedMonth) + 1)
          : parseInt(this.selectedMonth) + 1
      if (this.selectedMonth === 13) {
        this.selectedMonth = '01'
        this.selectedYear = this.selectedYear + 1
      }
      this.init(this.selectedYear, parseInt(this.selectedMonth))
      let nowDate = `${this.selectedYear}-${this.selectedMonth}`
      this.$emit('monthChange', nowDate)
    },
    // 日期点击
    onDateClick (val) {
      let nowDate = `${this.selectedYear}-${this.selectedMonth}-${val < 10 ? '0' + val : val}`
      this.$emit('click', nowDate)
      this.isSelect = val
    }
  }
}
</script>

<style lang="less">
#ch-calendar {
  width: 600px;
  height: 477px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid black;
  margin: 0 auto;
  .ch-calendar-title {
    font-size: 14px;
    margin-top: 10px;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px;
    margin-bottom: 10px;
  }
  .ch-calendar-main {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .calendar {
      margin-left: 10px;
      width: 280px;
      height: 340px;
      border: 1px solid #f0f0f0;
      .calendar-title {
        text-align: center;
        margin-top: 30px;
        cursor: default;

        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
      }
      .calendar-btn {
        display: inline-block;
        border-radius: 50%;
        cursor: pointer;
        width: 30px;
        height: 30px;
        line-height: 30px;
        &:nth-child(1) {
          margin-right: 10px;
        }
        &:nth-child(2) {
          margin-left: 10px;
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
      .calendar-main {
        margin: 0 auto;
        width: 260px;
        height: 260px;
        .calendar-main-head {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          color: rgba(0, 0, 0, 0.38);
          font-weight: 550;
          .calendar-main-head--item {
            text-align: center;
            width: 37px;
          }
        }
        .calendar-main-block {
          margin-top: 20px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .calendar-main-block--pre {
            font-size: 15px;
            text-align: center;
            width: 37px;
            height: 37px;
            line-height: 37px;
            border-radius: 50%;
            color: rgba(0, 0, 0, 0.38);
          }
          .calendar-main-block--item {
            box-sizing: border-box;
            border: 1px solid #fff;
            font-size: 15px;
            text-align: center;
            width: 37px;
            height: 37px;
            line-height: 37px;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
            &:hover {
              background-color: rgba(0, 0, 0, 0.1);
              color: #fff;
            }
          }
          .calendar-main-block--item.normal {
              position: relative;
              &::before {
                  display: inline-block;
                  position: absolute;
                  bottom: 0;
                  left: 14px;
                  content: '';
                  width: 8px;
                  height: 8px;
                  border-radius: 50px;
                  background-color: #007afe;
              }
          }
          .calendar-main-block--item.abnormal {
              position: relative;
              &::before {
                  display: inline-block;
                  position: absolute;
                  bottom: 0;
                  left: 14px;
                  content: '';
                  width: 8px;
                  height: 8px;
                  border-radius: 50px;
                  background-color: red;
              }
          }
          .calendar-main-block--item.select {
              background-color: #007afe;
              color: #fff;
          }
          .calendar-main-block--item.today {
              border: 1px solid #007afe;
          }
        }
      }
    }
    .ch-calendar-main-right {
      box-sizing: border-box;
      border-left: 1px solid #708090;
      width: 260px;
      padding: 20px;
      height: 378px;
      .ch-calendar-main-right-top {
        width: 200px;
        height: 120px;
        // border: 1px solid black;
        display: flex;
        justify-content: space-between;
        .ch-calendar-main-right-top--img {
          width: 90px;
          height: 100px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
      }
      .ch-calendar-main-right-bottom {
        width: 200px;
        height: 120px;
        // border: 1px solid black;
        margin-top: 65px;
        display: flex;
        justify-content: space-between;
        .ch-calendar-main-right-bottom--img {
          width: 90px;
          height: 100px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
      }
      &::before {
        box-sizing: border-box;
        display: inline-block;
        content: "上";
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        text-align: center;
        padding-top: 4px;
        background-color: #007afe;
        color: #fff;
        top: -22px;
        left: -34px;
      }
      &::after {
        box-sizing: border-box;
        display: inline-block;
        content: "下";
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        text-align: center;
        padding-top: 4px;
        background-color: #007afe;
        color: #fff;
        top: -174px;
        left: -34px;
      }
    }
  }
}
</style>
