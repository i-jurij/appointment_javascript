export let cssStyle = `
:root {
    color-scheme: light dark;
	--big: 1.5rem;
    --base: 1.2rem;
    --middle: 1.1rem;
    --small: 1rem;
    --rad: 0.4rem;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bgcolor-content: #282C34;
        --fontcolor-light: #E5B5BE;
        --date_time_item_back: #535353;
		--date_time_item_back-markadd: rgb(100, 2, 2);
		--date_time_item_back-markdel: rgb(9, 28, 44);
        --date_time_item_back-active: #9F091F;
        --date_time_item_back-disabled: #353941;
        --date_time_item_color-disabled: #676767;

		--light: #E5B5BE;
        --active: #9F091F;
        --dis: #161D26;
        --disabled: #43464e;
        --bg: #282C34;
        --border: 1px solid #000;
    }
}

@media (prefers-color-scheme: light) {
    :root {
        --bgcolor-content: rgba(245,243,246,1);
        --fontcolor-light: #444;
        --date_time_item_back: #E5E5E5;
		--date_time_item_back-markadd: gold;
		--date_time_item_back-markdel: steelblue;
        --date_time_item_back-active: #C3C9DF;
        --date_time_item_back-disabled: #ECECEC;
        --date_time_item_color-disabled: #A9A0A0;

		--light: #444;
        --active: #C3C9DF;
        --dis: #E5E5E5;
        --disabled: #CEC7D1;
        --bg: rgba(245,243,246,1);
        --border: 1px solid #C4C4C4;
    }
}

.clear {
	clear: both;
}
.text_center {
	text-align: center;
}
.hor_center {
	margin: 0 auto;
}
/*
#zapis_usluga_form, .but, .modal, .modal > div > button {
	font-family: 'Liberation Sans', Arial, "Helvetica CY", Helvetica, "Nimbus Sans L", "Roboto", "Noto Sans", sans-serif;
	font-size: var(--base);
	color: var(--fontcolor-light);
}
*/
.buts {
	margin: 1rem auto 0 auto;
	text-align: center;
}

.but {
	border: none;
	background: var(--date_time_item_back);
	cursor: pointer;
	padding: 1rem 2rem;
}

.but:hover {
	background: var(--date_time_item_back-active);
}

.but:disabled {
	background-color: var(--date_time_item_back-disabled);
  	color: var(--date_time_item_color-disabled);
}

.modal {
	position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center; /* см. ниже */
    align-items: center;
    z-index: 99;
    /* Чтобы окно не прилипало к границе
    браузера установим отступы */
    padding: 2rem;
	/* background: var(--bgcolor-content); */
	background: rgba(0,0,0,0.3);
  }

.modal > div {
	background: var(--bgcolor-content);
	padding: 2rem;
	text-align: center;
}

.modal > div > button {
	padding: 1rem 2rem;
	cursor: pointer;
}
/*
* short calendar
*/
.master_datetime {
	text-align: center;
	background: var(--bgcolor-content);
	padding: 2rem;
	color: var(--fontcolor-light, red);
	font-size: 1.2rem;
}

.master_dates {
	margin: 0 auto 1rem auto;
	/* width: 46.8rem; */
	white-space:nowrap;
	overflow: auto;
	overflow-y: hidden;
}

.master_times {
	margin: 2rem auto 0 auto;
	text-align: center;
	/* width: 46.8rem; */
}

.master_date, .master_time {
	display: inline-block;
	text-align: center;
	margin: 0.1rem;
	width: 5.5rem;
	background: var(--date_time_item_back);
}

.master_date input[type=radio],
.master_time  input[type=radio]{
	display: none;
}

.master_date label,
.master_time label {
	display: block;
	cursor: pointer;
	user-select: none;
}

.master_date label {
	padding: 0.2rem 0.2rem;
}
.master_time label {
	padding: 1rem 0;
}

.master_date input[type=radio]:checked + label,
.master_time input[type=radio]:checked + label {
	background: var(--date_time_item_back-active);
}

.master_date label:hover,
.master_time label:hover {
	background: var(--date_time_item_back-active);
}

.master_date input[type=radio]:disabled + label,
.master_time input[type=radio]:disabled + label {
	background: var(--date_time_item_back-disabled);
	color: var(--date_time_item_color-disabled);
}

/* ----------- resolution up to 1360px-------------- */
@media screen and (max-width: 1920px) {

	.master_datetime {
		max-width: 40rem;
		margin: 0 auto;
	}

	.master_dates {
		margin: 0 auto 1rem auto;
		white-space: normal;
		overflow: auto;
		overflow-y: auto;
		overflow-x: auto;
	}

	.master_times{
		width: auto;
	}
}

/* ----------- resolution up to 1360px-------------- */
@media screen and (max-width: 1360px) {

	.master_datetime {
		max-width: 30rem;
		margin: 0 auto;
	}

	.master_dates {
		margin: 0 auto 1rem auto;
		width: auto;
		height: 10.2rem;
		white-space: normal;
		overflow: auto;
		overflow-y: auto;
		overflow-x: auto;
	}

	.master_times{
		width: auto;
	}
}

/* ----------- resolution up to 640px-------------- */
@media screen and (max-width: 640px) {

	.master_datetime {
		max-width: 20rem;
		margin: 0 auto;
	}

	.master_dates {
		margin: 0 auto 1rem auto;
		width: auto;
		height: 13.5rem;
		white-space: normal;
		overflow: auto;
		overflow-y: auto;
		overflow-x: auto;
	}

	.master_times{
		width: auto;
	}
}

/*
* month calendar
*/
.calendar-wrapper {
	width: 25rem;
	margin: 1rem auto;
	padding: 2rem;
	border: var(--border);
	border-radius: var(--rad);
	background: var(--bg);
  }

  .table_month_cal{
	clear: both;
	width: 100%;
	/* border: var(--border); */
	border-radius: var(--rad);
	border-collapse: collapse;
	color: var(--light);
  }
  .td_month_cal {
	height: 48px;
	text-align: center;
	vertical-align: middle;
	border-right: var(--border);
	border-top: var(--border);
	width: 14.28571429%;
	font-size: var(--base);
	background-color: var(--date_time_item_back);
  }

  .thead_td_month_cal {
	border: none;
	color: var(--light);
	text-transform: uppercase;
	font-size: var(--base);
  }

  .not-current {
	  color: var(--disabled);
	  background: var(--date_time_item_back-disabled);
  }
  .normal, .today {
	cursor: pointer;
  }
  .today {
	font-weight: 700;
	color: var(--light);
	background-color: var(--active);
	font-size: var(--big);
  }

  #btnPrev {
	float: left;
	margin-bottom: 1rem;
  }

  #btnNext {
	float: right;
	margin-bottom: 1rem;
  }

  #btnPrev,
  #btnNext {
	background: transparent;
	border: none;
	outline: none;
	font-size: var(--small);
	color: var(--light);
	cursor: pointer;
	transition: all 0.3s ease;
  }

  #btnPrev:hover,
  #btnNext:hover {
	text-decoration: underline;
  }

  /*
* schedule calendar
*/
.shed_wrap {
	overflow-x: scroll;
	margin-left: 4.5rem;
	overflow-y: visible;
	padding: 0;
}

.head {
	height: 3rem;
}
.headcol {
	position: absolute;
	width: 3rem;
	left: 0.2rem;
	top: auto;
}

.schedule_caption {
	margin: 1rem;
	padding: 1rem;
}

#btnPre,
#btnNex {
  background: var(--date_time_item_back);
  cursor: pointer;
  padding: 1rem 2rem;
}

#btnPre:hover,
#btnNex:hover {
	background: var(--date_time_item_back-active);
}

.month {
	background: var(--date_time_item_back);
	padding: 1rem 2rem;
	margin: 0 1rem;
}

.tc_table {
	margin: 0.2rem;
	padding: 0;
	background-color: var(--bgcolor-content);
}
.tc_td {
	padding: 1rem;
	background-color: var(--date_time_item_back);
}

.tc_checked {
	background-color: var(--date_time_item_back-active);
}

.tc_mark_for_del {
	background-color: var(--date_time_item_back-markdel);
}
.tc_mark_for_add {
	background-color: var(--date_time_item_back-markadd);
}
.tc_disabled {
	background-color: var(--date_time_item_back-disabled);
	color: var(--date_time_item_color-disabled);
}
`