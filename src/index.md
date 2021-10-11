---
title: "Online Resources for Data Structures and Algorithms at Southwest University China"
layout: default
---

# Welcome to Data Structures and Algorithms at Southwest University, China { #welcome }

Welcome to the Data Structures and Algorithms course for the 2021 Autumn
semester, commencing **Wednesday 13/10/2021**{ class="hi-pri" }.
The [**schedule**](#schedule){ class="hi-pri" } below will have links added to it as the
course progresses, linking to:

- lecture slides
- Java code
- problem sheets
- lecture videos

Material from the **2020 version**{ class="hi-pri" } of this
course can be found
<a data-href="https://teaching.csse.uwa.edu.au/units/DSA-SWU/2020/" class="old-link" >
**here**
</a>.

## Lecture readings

Your understanding of the lecture material will be much greater if
***before***{ class="hi-pri" } each lecture, you read through the
related textbook sections.

The textbook we use is:

- Mark Allen Weiss, *Data Structures & Problem Solving Using Java* (4th edn, Pearson Education) \
  ISBN-13: 9780321541406\
  ISBN-10: 0321541405

(Other editions are also fine.)

The [schedule](#schedule) below lists, for each topic, the related
textbook sections you should review.

## Homework

*Problem sheets*{ class="hi-pri" } will be used during class. The problem
sheets will be uploaded during each of the lecture weeks. Click on
the links in the schedule to download the problem sheets.

There is also *lab material*{ class="hi-pri" } for you to work through using
your computer, which you can find [**here**][lab-material]{ class="hi-pri" }.

[lab-material]: {{ "/resources#lab-materials" | url }}

------------------------------------------------------------------------

## Announcements

- Announcements and updates will be added here
  as the course progresses.

---------

## Schedule and links to material { #schedule }

This table will be updated as the course progresses.

<div class="overwidth" style="width: 100vw; margin-left: calc(50% - 50vw);" >

<table class="csse-table" >
<colgroup>
<col style="width: 10%;">
<col style="width: 10%">
<col style="width: 30%">
<col style="width: 33%">
<col style="width: 17%">
</colgroup>
<tbody>
<tr>
<th>
  Week
</th>
<th>
  Day
</th>
<th>
  Topics
</th>
<th>
  Materials
</th>
<th>
  Times (GMT+8 Perth/Beijing time)
</th>
</tr>


{%- for week in schedule.weeks -%}
  {% set wkIdx = loop.index %}
  {%- for day in week.days -%}
  {% set dayIdx = loop.index %}

  <tr>
  {% if dayIdx == "1" %}
  <td rowspan="2" style="text-align: center;" >
  <b><span class="mobile-visible">week </span>{{ week.weekNum }}:</b><br>
  <b>{{ week.weekTopic }}</b>
  </td>
  {% else %}
  {% endif %}

  <td>

  {{ day.weekday }}<br>
  {{ day.date}}
  </td>
  <td class="materials-cell" >
  <ul>
  {%- for topic in day.topics -%}
     <li>{{ topic }}</li>
  {%- endfor -%}
  </ul>
  </td>
  <td class="materials-cell" >
  {{ day.materials | safe }}
  </td>
  <td>
  <ul>
  {%- for time in day.times -%}
     <li>{{ time }}</li>
  {%- endfor -%}
  </ul>
  </td>
  </tr>

  {%- endfor -%} <!-- end days -->
{%- endfor -%} <!-- end weeks -->


</tbody>
</table>

</div>


<script type="text/javascript">
(function() {
  let oldLinks = document.getElementsByClassName('old-link');
  for (var i=0, link; i < oldLinks.length; i++) {
    link = oldLinks[i];
    link.href = link.attributes['data-href'].value;
  }
}
)();

</script>


<!--
vim: syntax=markdown :
-->
