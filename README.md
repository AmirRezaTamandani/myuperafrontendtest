thank you for your kind observations in advance!
I tried to diversify my code into branches, so it could be developed properly
I didnt add pages folder as this table is but a component and I didn't had any page so i just put it in the main page (it's not a good thing!)

if you need to add or change custom colors , you can visit 'tailwind.config.ts'
the design and data weren't really connected so I did a little improvisation and I tried to keep the project as pixel perfect as possible!
they are some pixeled values in the code because the design had them and they weren't compatible with default rem system of the tailwind (i am sure it wouldn't be a problem, right , right :) !)

for making changes to table you can go to "DataTable.tsx" and add or remove columns.
if you need more in depth changes, I tried to be as clear as possible, that's why you might see long names,long understandable name is 1000 time better than a forgettable shorthand!

for making change to request , you can visit hooks folder and add or edit the req, I tried to write it as ordinary as possible so it could be improved later on!
the GET method is put in useFetchData, it uses axios and react query, nothing special there!
the hook posses loading and error function, yet it wasn't in design and so i avoided more improvisation
the types are in type folder and you can easily add more if needed
query context has wrapped around the layout you can do more things in there and the main reason for this was to keep SSR intact !(you can avoid wrapping and just write it in layout yet it will make whole project CSR and that is bad as they say! )

there is a Debounce search input to search throughout ALL of the table, and the sorting is inside the DataTable itself, and I used Built in sorter in tanstack table!



everything is straight forward, if there is a problem I'll be happy to adjust them!