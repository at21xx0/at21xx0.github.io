
maxnum=500
minnum=440
flag=4 # 最低分 平均分 最低档次 4, 5, 6
import xlwt
workbook=xlwt.Workbook();
sheet=workbook.add_sheet("save");
#style=xlwt.easyxf('font: name Times New Roman, color-index red, bold on', num_format_str='#,##0.00')   #数据格式

#sheet.write(0,0,"wl");


import xlrd
lb=[];
workxls =xlrd.open_workbook("input.xlsx")
worksheet = workxls.sheet_by_name("2019年本科理工类")
row =worksheet.nrows#总行数
for i in range(row):
    rowdate=worksheet.row_values(i)
    la=[];
    o=0;
    for a in enumerate(rowdate):
        la.append(a[1]);
        if a[0]==flag:
            try:
                c=int(float(a[1]));
                #print(c);
                if c>minnum and c<maxnum:
                    o=1;
                    #print(c);
                else:
                    break;
            except:
                pass
    if o==1:
        lb.append(la);
if not lb:
    print("None");
    exit(1);
la=[];
for a in lb:
    la.append(int(float(a[flag])));
lc=list(set(la)); # 去重
lc.sort();
j=0;
for a in lc:
    for b in range(0,len(la)):
        if a==la[b]:
            for i in range(0,7):
                sheet.write(j,i,lb[b][i]);
            j=j+1;
workbook.save("output.xlsx");

